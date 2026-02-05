-- ============================================================
-- HIPAA AUDIT LOG ACCEPTANCE TESTS
-- Run these tests to verify audit logging is properly configured
-- 
-- Instructions:
-- 1. Run this script in Supabase SQL Editor
-- 2. Screenshot/save the results
-- 3. All tests should show "✓ PASS" 
-- ============================================================

-- ============================================================
-- TEST A: IMMUTABILITY PROOF
-- Verify UPDATE and DELETE are blocked
-- ============================================================

-- A1: Test UPDATE is blocked
DO $$
DECLARE
    test_id UUID;
    err_msg TEXT;
BEGIN
    -- First insert a test record
    INSERT INTO audit_log (entity_type, entity_id, action, actor_type)
    VALUES ('test', 'test-acceptance', 'TEST', 'system')
    RETURNING id INTO test_id;
    
    -- Try to UPDATE (should fail)
    BEGIN
        UPDATE audit_log SET action = 'MODIFIED' WHERE id = test_id;
        RAISE NOTICE '✗ FAIL: UPDATE should have been blocked but succeeded';
    EXCEPTION WHEN OTHERS THEN
        err_msg := SQLERRM;
        IF err_msg LIKE '%AUDIT_LOG_IMMUTABLE%' THEN
            RAISE NOTICE '✓ PASS: UPDATE correctly blocked with message: %', err_msg;
        ELSE
            RAISE NOTICE '✗ FAIL: UPDATE blocked but wrong error: %', err_msg;
        END IF;
    END;
END $$;

-- A2: Test DELETE is blocked
DO $$
DECLARE
    test_id UUID;
    err_msg TEXT;
BEGIN
    -- Get a test record
    SELECT id INTO test_id FROM audit_log WHERE entity_type = 'test' LIMIT 1;
    
    IF test_id IS NULL THEN
        RAISE NOTICE '✗ SKIP: No test record found for DELETE test';
        RETURN;
    END IF;
    
    -- Try to DELETE (should fail)
    BEGIN
        DELETE FROM audit_log WHERE id = test_id;
        RAISE NOTICE '✗ FAIL: DELETE should have been blocked but succeeded';
    EXCEPTION WHEN OTHERS THEN
        err_msg := SQLERRM;
        IF err_msg LIKE '%AUDIT_LOG_IMMUTABLE%' THEN
            RAISE NOTICE '✓ PASS: DELETE correctly blocked with message: %', err_msg;
        ELSE
            RAISE NOTICE '✗ FAIL: DELETE blocked but wrong error: %', err_msg;
        END IF;
    END;
END $$;

-- ============================================================
-- TEST B: RLS PROOF
-- Verify access controls
-- Note: These tests need to be run with different roles
-- ============================================================

-- B1: Check RLS is enabled
SELECT 
    CASE WHEN relrowsecurity THEN '✓ PASS' ELSE '✗ FAIL' END AS "RLS Enabled",
    'audit_log' AS table_name
FROM pg_class 
WHERE relname = 'audit_log';

-- B2: Check RLS is enabled on archive
SELECT 
    CASE WHEN relrowsecurity THEN '✓ PASS' ELSE '✗ FAIL' END AS "RLS Enabled",
    'audit_log_archive' AS table_name
FROM pg_class 
WHERE relname = 'audit_log_archive';

-- B3: List current policies
SELECT 
    policyname,
    permissive,
    cmd,
    roles::text
FROM pg_policies 
WHERE tablename IN ('audit_log', 'audit_log_archive')
ORDER BY tablename, policyname;

-- ============================================================
-- TEST C: COVERAGE PROOF
-- Sample audit entries showing different action types
-- ============================================================

-- C1: Check for variety of action types in audit log
SELECT 
    action,
    COUNT(*) as count,
    MAX(created_at) as latest
FROM audit_log
GROUP BY action
ORDER BY count DESC
LIMIT 20;

-- C2: Sample entries by entity type
SELECT 
    entity_type,
    COUNT(*) as count,
    COUNT(DISTINCT action) as unique_actions
FROM audit_log
GROUP BY entity_type
ORDER BY count DESC
LIMIT 15;

-- C3: Sample recent entries (8 examples per the acceptance criteria)
SELECT 
    id,
    entity_type,
    entity_id,
    action,
    actor_id,
    CASE WHEN old_values IS NOT NULL THEN 'has_diff' ELSE NULL END as has_old_values,
    CASE WHEN new_values IS NOT NULL THEN 'has_diff' ELSE NULL END as has_new_values,
    changed_fields,
    success,
    created_at
FROM audit_log
ORDER BY created_at DESC
LIMIT 20;

-- ============================================================
-- TEST D: TRIGGER VERIFICATION
-- Verify triggers exist and are enabled
-- ============================================================

SELECT 
    tgname as trigger_name,
    tgrelid::regclass as table_name,
    tgenabled as enabled,
    CASE 
        WHEN tgenabled = 'O' THEN '✓ PASS: Trigger enabled (origin)'
        WHEN tgenabled = 'D' THEN '✗ FAIL: Trigger DISABLED'
        WHEN tgenabled = 'R' THEN '✓ PASS: Trigger enabled (replica)'
        WHEN tgenabled = 'A' THEN '✓ PASS: Trigger enabled (always)'
        ELSE '? Unknown state'
    END as status
FROM pg_trigger 
WHERE tgname LIKE 'audit_log%'
ORDER BY tgrelid::regclass, tgname;

-- ============================================================
-- TEST E: INDEX VERIFICATION
-- Verify performance indexes exist
-- ============================================================

SELECT 
    indexname,
    tablename,
    '✓ PASS' as status
FROM pg_indexes 
WHERE tablename IN ('audit_log', 'audit_log_archive')
AND indexname LIKE 'idx_audit_log%'
ORDER BY tablename, indexname;

-- ============================================================
-- TEST F: COLUMN VERIFICATION
-- Verify all required columns exist
-- ============================================================

SELECT 
    column_name,
    data_type,
    is_nullable,
    '✓ PASS' as status
FROM information_schema.columns 
WHERE table_name = 'audit_log'
ORDER BY ordinal_position;

-- ============================================================
-- SUMMARY
-- ============================================================

SELECT '
============================================================
ACCEPTANCE TEST SUMMARY
============================================================

Run each section above and verify:

A) IMMUTABILITY
   [ ] UPDATE blocked with AUDIT_LOG_IMMUTABLE error
   [ ] DELETE blocked with AUDIT_LOG_IMMUTABLE error

B) RLS POLICIES  
   [ ] RLS enabled on audit_log
   [ ] RLS enabled on audit_log_archive
   [ ] Only service_role can INSERT
   [ ] Only admin/compliance can SELECT

C) COVERAGE (check sample entries show)
   [ ] VIEW clinical_note
   [ ] UPDATE clinical_note (with diff)
   [ ] VIEW client
   [ ] UPDATE appointment
   [ ] ADMIN role change
   [ ] EXPORT action
   [ ] AUTH_LOGIN_SUCCESS
   [ ] REFUND_CREATED (if payments exist)

D) TRIGGERS
   [ ] audit_log_prevent_update enabled
   [ ] audit_log_prevent_delete enabled
   [ ] archive triggers enabled

E) INDEXES
   [ ] idx_audit_log_created_at_desc
   [ ] idx_audit_log_actor_created
   [ ] idx_audit_log_entity

F) COLUMNS
   [ ] request_id
   [ ] success
   [ ] session_id
   [ ] old_values
   [ ] new_values
   [ ] changed_fields
   [ ] resource_path

============================================================
' as instructions;
