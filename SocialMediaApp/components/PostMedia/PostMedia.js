import React, { useRef, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';

const PostMedia = ({ mediaType = 'image', mediaUrl, imageStyle }) => {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);

  if (!mediaUrl) {
    return <View style={imageStyle} />;
  }

  if (mediaType === 'video') {
    return (
      <TouchableOpacity activeOpacity={1} onPress={() => setPaused((p) => !p)}>
        <Video
          ref={videoRef}
          source={{ uri: mediaUrl }}
          style={imageStyle}
          resizeMode="cover"
          paused={paused}
          repeat={false}
        />
      </TouchableOpacity>
    );
  }

  return (
    <Image
      source={{ uri: mediaUrl }}
      style={imageStyle}
      resizeMode="cover"
    />
  );
};

export default PostMedia;