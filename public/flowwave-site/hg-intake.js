/**
 * FlowWave landing intake — payload collector for DC onSubmit handler.
 * Patched into index.html via scripts/patch-flowwave-intake.mjs
 */
(function () {
  "use strict";

  var TREATMENT_LABELS = [
    "Knee",
    "Shoulder",
    "Low back",
    "Elbow",
    "Foot / ankle",
    "Hand / wrist",
    "Neck",
    "Hip",
    "Men's wellness",
  ];

  var SCREENING_KEYS = [
    "pacemaker",
    "pregnant",
    "metal",
    "blood_thinners",
    "cancer",
    "none",
  ];

  function val(el) {
    return el && el.value ? String(el.value).trim() : "";
  }

  function checkedLabels(container, labels) {
    var boxes = container.querySelectorAll('input[type="checkbox"]');
    var out = [];
    for (var i = 0; i < boxes.length && i < labels.length; i++) {
      if (boxes[i].checked) out.push(labels[i]);
    }
    return out;
  }

  window.HG_flowwaveCollect = function collect(form) {
    var inputs = form.querySelectorAll(".fw-inp");
    var name = val(inputs[0]);
    var phone = val(inputs[1]);
    var email = val(inputs[2]);
    var location = inputs[3] ? val(inputs[3]) : "Oswego";
    var notesEl = form.querySelector("textarea.fw-inp");
    var notes = notesEl ? val(notesEl) : "";

    var chipSections = form.querySelectorAll('[style*="grid-template-columns"]');
    var treatmentSection = chipSections[1];
    var screeningSection = chipSections[2];

    var treatmentAreas = treatmentSection
      ? checkedLabels(treatmentSection, TREATMENT_LABELS)
      : [];

    var screeningLabels = screeningSection
      ? checkedLabels(screeningSection, [
          "Pacemaker / implanted device",
          "Pregnant or possibly pregnant",
          "Metal implant in the area",
          "Blood thinners / clotting disorder",
          "Active cancer or tumor",
          "None of the above",
        ])
      : [];

    var screeningFlags = [];
    screeningLabels.forEach(function (label, idx) {
      if (label.indexOf("None") === 0) screeningFlags.push("none");
      else if (SCREENING_KEYS[idx]) screeningFlags.push(SCREENING_KEYS[idx]);
    });

    var consentBox = form.querySelector('input[type="checkbox"][required]');
    var consent = consentBox ? consentBox.checked : false;

    return {
      fullName: name,
      phone: phone,
      email: email,
      preferredLocation: location,
      treatmentAreas: treatmentAreas,
      screeningFlags: screeningFlags,
      notes: notes,
      consent: consent,
      hp: "",
    };
  };
})();
