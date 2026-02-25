import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import UserProfileImage from '../UserProfileImage/UserProfileImage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faEllipsisH,
  faHeart as faHeartSolid,
  faBookmark as faBookmarkSolid,
} from '@fortawesome/free-solid-svg-icons';
import {
  faHeart as faHeartRegular,
  faBookmark as faBookmarkRegular,
  faMessage,
} from '@fortawesome/free-regular-svg-icons';
import style from './style';
import { horizontalScale, scaleFontSize } from '../../assets/styles/scaling';

const UserPost = (props) => {
  const postImageSource =
    typeof props.image === 'string' && props.image.trim()
      ? { uri: props.image }
      : props.image || require('../../assets/images/default_post.png');

  return (
    <View style={style.userPostContainer}>
      <View style={style.user}>
        <View style={style.userContainer}>
          <UserProfileImage
            profileImage={props.profileImage}
            imageDimensions={horizontalScale(48)}
          />

          <View style={style.userTextContainer}>
            <Text style={style.username}>
              {props.firstName} {props.lastName}
            </Text>
            {props.location ? <Text style={style.location}>{props.location}</Text> : null}
          </View>
        </View>

        <FontAwesomeIcon icon={faEllipsisH} size={scaleFontSize(20)} color={'#79869F'} />
      </View>

      <View style={style.postImage}>
        <Image source={postImageSource} style={style.postImageSource} resizeMode="cover" />
      </View>

      <View style={style.userPostStats}>
        <TouchableOpacity style={style.userPostStatButton} onPress={props.onToggleLike}>
          <FontAwesomeIcon icon={props.isLiked ? faHeartSolid : faHeartRegular} color={props.isLiked ? '#EF4444' : '#79869F'} />
          <Text style={style.userPostStatText}>{props.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={style.userPostStatButtonRight} onPress={props.onOpenComments}>
          <FontAwesomeIcon icon={faMessage} color={'#79869F'} />
          <Text style={style.userPostStatText}>{props.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={style.userPostStatButtonRight} onPress={props.onToggleSave}>
          <FontAwesomeIcon icon={props.isSaved ? faBookmarkSolid : faBookmarkRegular} color={props.isSaved ? '#111827' : '#79869F'} />
          <Text style={style.userPostStatText}>{props.bookmarks}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

UserPost.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string,
  location: PropTypes.string,
  image: PropTypes.any,
  profileImage: PropTypes.any,
  likes: PropTypes.number,
  comments: PropTypes.number,
  bookmarks: PropTypes.number,
  isLiked: PropTypes.bool,
  isSaved: PropTypes.bool,
  onToggleLike: PropTypes.func,
  onToggleSave: PropTypes.func,
  onOpenComments: PropTypes.func,
};

UserPost.defaultProps = {
  lastName: '',
  likes: 0,
  comments: 0,
  bookmarks: 0,
  isLiked: false,
  isSaved: false,
  onToggleLike: () => {},
  onToggleSave: () => {},
  onOpenComments: () => {},
};

export default UserPost;