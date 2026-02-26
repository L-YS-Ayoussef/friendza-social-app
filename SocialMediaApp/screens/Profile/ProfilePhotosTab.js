import React from 'react';
import ProfileMediaGrid from '../../components/ProfileMediaGrid/ProfileMediaGrid';

const ProfilePhotosTab = () => <ProfileMediaGrid endpoint="/posts/me?mediaType=image" />;

export default ProfilePhotosTab;