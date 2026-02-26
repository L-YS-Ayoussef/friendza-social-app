import React from 'react';
import ProfileMediaGrid from '../../components/ProfileMediaGrid/ProfileMediaGrid';

const ProfileVideosTab = () => <ProfileMediaGrid endpoint="/posts/me?mediaType=video" />;

export default ProfileVideosTab;