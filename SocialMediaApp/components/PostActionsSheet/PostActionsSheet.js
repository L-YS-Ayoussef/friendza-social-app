import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faEye,
  faTrash,
  faPen,
  faPlus,
  faBookmark,
  faUserPlus,
  faUserMinus,
} from '@fortawesome/free-solid-svg-icons';
import style from './style';

const SHEET_HEIGHT = 340;

const PostActionsSheet = ({
  visible,
  onClose,
  post,
  isOwner,
  canEdit,

  // state for labels
  isFollowingAuthor,
  isSaved,

  // callbacks (must return promises)
  onView,
  onEdit,
  onDelete,
  onAddToStory,
  onToggleFollow,
  onToggleSave,

  // toast callback
  showToast,
}) => {
  const [busyKey, setBusyKey] = useState(null);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(anim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    } else {
      Animated.timing(anim, { toValue: 0, duration: 220, useNativeDriver: true }).start();
      setBusyKey(null);
    }
  }, [visible, anim]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [SHEET_HEIGHT, 0],
  });

  const actions = useMemo(() => {
    if (!post) return [];

    if (isOwner) {
      return [
        { key: 'view', label: 'View', icon: faEye },
        ...(canEdit ? [{ key: 'edit', label: 'Edit', icon: faPen }] : []),
        { key: 'addToStory', label: 'Add to story', icon: faPlus },
        { key: 'delete', label: 'Delete', icon: faTrash, danger: true },
      ];
    }

    return [
      {
        key: 'follow',
        label: isFollowingAuthor ? 'Unfollow' : 'Follow',
        icon: isFollowingAuthor ? faUserMinus : faUserPlus,
      },
      {
        key: 'save',
        label: isSaved ? 'Unsave' : 'Save',
        icon: faBookmark,
      },
      { key: 'view', label: 'View', icon: faEye },
    ];
  }, [post, isOwner, canEdit, isFollowingAuthor, isSaved]);

  const run = async (key, fn) => {
    if (busyKey) return;
    try {
      setBusyKey(key);
      await fn();
    } finally {
      setBusyKey(null);
    }
  };

  const handlePress = (actionKey) => {
    if (!post) return;

    if (actionKey === 'view') {
      onClose?.();
      onView?.();
      return;
    }

    if (actionKey === 'edit') {
      onClose?.();
      onEdit?.();
      return;
    }

    if (actionKey === 'delete') {
      Alert.alert('Delete post', 'Are you sure you want to delete this post?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            run('delete', async () => {
              await onDelete?.();
              showToast?.('Post deleted ✅');
              onClose?.();
            }),
        },
      ]);
      return;
    }

    if (actionKey === 'addToStory') {
      run('addToStory', async () => {
        await onAddToStory?.();
        showToast?.('Added to your story ✅');
        onClose?.();
      });
      return;
    }

    if (actionKey === 'follow') {
      run('follow', async () => {
        const nextIsFollowing = await onToggleFollow?.(); // expect boolean
        showToast?.(nextIsFollowing ? `Now following @${post.username}` : `Unfollowed @${post.username}`);
        onClose?.();
      });
      return;
    }

    if (actionKey === 'save') {
      run('save', async () => {
        const nextIsSaved = await onToggleSave?.(); // expect boolean
        showToast?.(nextIsSaved ? 'Saved successfully ✅' : 'Removed from saved');
        onClose?.();
      });
      return;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={style.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View style={[style.sheet, { transform: [{ translateY }] }]}>
        <View style={style.sheetHandle} />
        <Text style={style.title}>Actions</Text>

        {actions.map((a) => (
          <TouchableOpacity
            key={a.key}
            style={[style.row, a.danger && style.rowDanger]}
            onPress={() => handlePress(a.key)}
            disabled={!!busyKey}
          >
            <View style={style.rowLeft}>
              <FontAwesomeIcon icon={a.icon} size={18} color={a.danger ? '#EF4444' : '#111827'} />
              <Text style={[style.rowText, a.danger && style.rowTextDanger]}>{a.label}</Text>
            </View>

            {busyKey === a.key ? <ActivityIndicator /> : null}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={style.cancelBtn} onPress={onClose} disabled={!!busyKey}>
          <Text style={style.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

export default PostActionsSheet;