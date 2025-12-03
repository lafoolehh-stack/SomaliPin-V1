import React from 'react';
import { Profile, VerificationLevel } from '../types';
import { GoldenBadge, HeroBadge, StandardBadge } from './Icons';

interface ProfileCardProps {
  profile: Profile;
  onClick: (profile: Profile) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onClick }) => {
  
  const renderBadge = () => {
    if (!profile.verified) return null;

    switch (profile.verificationLevel) {
      case VerificationLevel.HERO:
        return (
          <div className="text-red-700" title="National Hero / Halyey Qaran">
            <HeroBadge className="w-6 h-6" />
          </div>
        );
      case VerificationLevel.GOLDEN:
        return (
          <div className="text-gold" title="Golden Verified / Heerka Sare">
            <GoldenBadge className="w-6 h-6" />
          </div>
        );
      case VerificationLevel.STANDARD:
      default:
        return (
          <div className="text-navy-light" title="Verified Entity / Mid Caadi ah">
            <StandardBadge className="w-6 h-6" />
          </div>
        );
    }
  };

  return (
    <div 
      onClick={() => onClick(profile)}
      className={`group relative bg-white border-t-4 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden rounded-sm
        ${profile.verificationLevel === VerificationLevel.HERO ? 'border-red-800' : 
          profile.verificationLevel === VerificationLevel.STANDARD ? 'border-navy-light' : 'border-gold'}
      `}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="relative">
            <img 
              src={profile.imageUrl} 
              alt={profile.name} 
              className={`w-20 h-20 object-cover rounded-sm border grayscale group-hover:grayscale-0 transition-all duration-500
                ${profile.verificationLevel === VerificationLevel.HERO ? 'border-red-100' : 'border-gray-100'}
              `}
            />
          </div>
          {renderBadge()}
        </div>
        
        <div className="space-y-1">
          <span className={`text-xs font-bold tracking-widest uppercase
             ${profile.verificationLevel === VerificationLevel.HERO ? 'text-red-700' : 
               profile.verificationLevel === VerificationLevel.STANDARD ? 'text-navy-light' : 'text-gold'}
          `}>
            {profile.category}
          </span>
          <h3 className="text-xl font-serif font-bold text-navy leading-tight group-hover:text-gold-dark transition-colors">
            {profile.name}
          </h3>
          <p className="text-xs text-gray-400 font-sans uppercase tracking-wide">
            {profile.title}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {profile.shortBio}
          </p>
        </div>

        <div className="mt-4 flex items-center text-navy font-medium text-sm group-hover:translate-x-1 transition-transform">
          View Dossier <span className="ml-2">→</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;