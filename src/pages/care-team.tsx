import React, { useState } from 'react';
import Header from '../components/Header';

// Care team data - update with your actual team members
const careTeam = [
  {
    id: 'team-1',
    name: 'Dr. Sarah Johnson',
    title: 'Medical Director',
    specialty: 'Aesthetic Medicine & Injectables',
    bio: 'With over 15 years of experience in aesthetic medicine, Dr. Johnson leads our team with expertise and care.',
    videoFile: 'dr-sarah-johnson.mp4', // Add this video to /public/videos/care-team/
  },
  {
    id: 'team-2',
    name: 'Emily Chen',
    title: 'Senior Aesthetician',
    specialty: 'Skincare & Facials',
    bio: 'Emily specializes in customized skincare treatments and has helped thousands achieve their skin goals.',
    videoFile: 'emily-chen.mp4', // Add this video to /public/videos/care-team/
  },
  {
    id: 'team-3',
    name: 'Maria Rodriguez',
    title: 'Laser Specialist',
    specialty: 'Laser Treatments & Body Contouring',
    bio: 'Maria is certified in the latest laser technologies and body sculpting techniques.',
    videoFile: 'maria-rodriguez.mp4', // Add this video to /public/videos/care-team/
  },
];

interface TeamMember {
  id: string;
  name: string;
  title: string;
  specialty: string;
  bio: string;
  videoFile: string;
}

interface ChatBoxProps {
  member: TeamMember;
}

const TeamMemberChatBox: React.FC<ChatBoxProps> = ({ member }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="expert-chat-box">
      <div className="chat-header">
        <div className="expert-avatar">
          {member.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="expert-info">
          <h3>{member.name}</h3>
          <span className="expert-title">{member.title}</span>
        </div>
        <div className="online-status">
          <span className="status-dot"></span>
          Available
        </div>
      </div>
      
      <div className="chat-content">
        <div className="message-bubble">
          <p><strong>Specialty:</strong> {member.specialty}</p>
          <p>{member.bio}</p>
        </div>
        
        <div className="video-section">
          {!isVideoOpen ? (
            <button 
              className="video-trigger"
              onClick={() => setIsVideoOpen(true)}
            >
              <span className="play-icon">▶</span>
              <span>Watch my introduction video</span>
            </button>
          ) : (
            <div className="video-container">
              <video 
                src={`/videos/care-team/${member.videoFile}`}
                controls
                autoPlay
                width="100%"
              >
                Your browser does not support the video tag.
              </video>
              <button 
                className="close-video"
                onClick={() => setIsVideoOpen(false)}
              >
                Close video
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="chat-footer">
        <button className="book-btn">Book with {member.name.split(' ')[0]}</button>
      </div>
    </div>
  );
};

const MeetYourCareTeam: React.FC = () => {
  return (
    <div>
      <Header />
      <main className="experts-page">
        <div className="experts-header">
          <h1>Meet Your Care Team</h1>
          <p>Get to know our talented team through their personal introduction videos</p>
        </div>
        
        <div className="experts-grid">
          {careTeam.map((member) => (
            <TeamMemberChatBox key={member.id} member={member} />
          ))}
        </div>

        {/* Instructions for adding videos - remove after adding videos */}
        <div className="video-instructions">
          <h3>How to Add Care Team Videos</h3>
          <p>Upload video files to: <code>/public/videos/care-team/</code></p>
          <ul>
            <li>dr-sarah-johnson.mp4</li>
            <li>emily-chen.mp4</li>
            <li>maria-rodriguez.mp4</li>
          </ul>
          <p><em>Remove this instructions box once videos are added.</em></p>
        </div>
      </main>
    </div>
  );
};

export default MeetYourCareTeam;
