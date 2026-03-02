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
import PostMedia from '../PostMedia/PostMedia';
import useT from '../../i18n/useT';
import { useThemeMode } from '../../context/ThemeContext';

const UserPost = (props) => {
  const { t } = useT();
  const { colors } = useThemeMode();

  const formatRelativePostTime = (value) => {
    if (!value) return '';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;

    if (diffMs < minute) return t('time.justNow');
    if (diffMs < hour) return `${Math.floor(diffMs / minute)} ${t('time.minShort')}`;
    if (diffMs < day) return `${Math.floor(diffMs / hour)} ${t('time.hourShort')}`;
    if (diffMs < week) return `${Math.floor(diffMs / day)} ${t('time.dayShort')}`;

    // local timezone display
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <View style={[style.userPostContainer, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
      <View style={style.user}>
        <View style={style.userContainer}>
          <TouchableOpacity onPress={props.onPressAvatar}>
            <UserProfileImage profileImage={props.profileImage} imageDimensions={horizontalScale(48)} />
          </TouchableOpacity>

          <View style={style.userTextContainer}>
            <TouchableOpacity onPress={props.onPressUsername} style={style.userNameContainer}>
              <Text style={[style.username, { color: colors.text }]}>{props.firstName} {props.lastName}</Text>
            </TouchableOpacity>
            <Text style={[style.postMetaText, { color: colors.muted }]}>
              {!!props.location && <Text style={[style.location, { color: colors.subText }]}>{props.location}</Text>}
              {formatRelativePostTime(props.createdAt)}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={props.onOpenActions} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <FontAwesomeIcon icon={faEllipsisH} size={scaleFontSize(20)} color={colors.icon} />
        </TouchableOpacity>
      </View>

      <View style={style.mediaContainer}>
        <PostMedia
          mediaType={props.mediaType}
          mediaUrl={props.mediaUrl}
          imageStyle={style.postImage}
        />
      </View>

      <View style={style.userPostStats}>
        <View style={style.userPostStatButton}>
          <TouchableOpacity onPress={props.onToggleLike} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <FontAwesomeIcon
              icon={props.isLiked ? faHeartSolid : faHeartRegular}
              color={props.isLiked ? colors.tertiary : colors.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={props.onOpenLikes}
            disabled={!props.onOpenLikes}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[style.userPostStatText, { color: colors.subText }]}>{props.likes}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={style.userPostStatButtonRight} onPress={props.onOpenComments}>
          <FontAwesomeIcon icon={faMessage} color={colors.icon} />
          <Text style={[style.userPostStatText, { color: colors.subText }]}>{props.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={style.userPostStatButtonRight} onPress={props.onToggleSave}>
          <FontAwesomeIcon
            icon={props.isSaved ? faBookmarkSolid : faBookmarkRegular}
            color={props.isSaved ? colors.text : colors.icon}
          />
          <Text style={[style.userPostStatText, { color: colors.subText }]}>{props.bookmarks}</Text>
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
  onPressUsername: PropTypes.func,
  onPressAvatar: PropTypes.func,
  mediaType: PropTypes.string,
  mediaUrl: PropTypes.string,
  onOpenLikes: PropTypes.func,
  onOpenActions: PropTypes.func,
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
  onOpenLikes: undefined,
  onOpenActions: () => {},
};

export default UserPost;