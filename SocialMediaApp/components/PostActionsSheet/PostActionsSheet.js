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
import useT from '../../i18n/useT';

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
  const { t, isRTL  } = useT();

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
        { key: 'view', label: t('common.view'), icon: faEye },
        ...(canEdit ? [{ key: 'edit', label: t('common.edit'), icon: faPen }] : []),
        { key: 'addToStory', label: t('common.addToStory'), icon: faPlus },
        { key: 'delete', label: t('common.delete'), icon: faTrash, danger: true },
      ];
    }

    return [
      {
        key: 'follow',
        label: isFollowingAuthor ? t('common.unfollow') : t('common.follow'),
        icon: isFollowingAuthor ? faUserMinus : faUserPlus,
      },
      {
        key: 'save',
        label: isSaved ? t('common.unsave') : t('common.save'),
        icon: faBookmark,
      },
      { key: 'view', label: t('common.view'), icon: faEye },
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
      Alert.alert('Delete post', t('post.deletePostConfirm'), [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('post.deletePostTitle'),
          style: 'destructive',
          onPress: () =>
            run('delete', async () => {
              await onDelete?.();
              showToast?.(t('post.postDeleted'));
              onClose?.();
            }),
        },
      ]);
      return;
    }

    if (actionKey === 'addToStory') {
      run('addToStory', async () => {
        await onAddToStory?.();
        showToast?.(t('post.addedToStory'));
        onClose?.();
      });
      return;
    }

    if (actionKey === 'follow') {
      run('follow', async () => {
        const nextIsFollowing = await onToggleFollow?.(); // expect boolean
        showToast?.(nextIsFollowing ? t('post.nowFollowing', { username: post.username }) : t('post.unfollowed', { username: post.username }));
        onClose?.();
      });
      return;
    }

    if (actionKey === 'save') {
      run('save', async () => {
        const nextIsSaved = await onToggleSave?.(); // expect boolean
        showToast?.(nextIsSaved ? t('post.savedOk') : t('post.unsavedOk'));
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
        <Text style={style.title}>{t('post.actionsTitle')}</Text>

        {actions.map((a) => (
          <TouchableOpacity
            key={a.key}
            style={[style.row, a.danger && style.rowDanger]}
            onPress={() => handlePress(a.key)}
            disabled={!!busyKey}
          >
            <View style={[style.rowLeft, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <FontAwesomeIcon icon={a.icon} size={18} color={a.danger ? '#EF4444' : '#111827'} />
              <Text style={[style.rowText, a.danger && style.rowTextDanger]}>{a.label}</Text>
            </View>

            {busyKey === a.key ? <ActivityIndicator /> : null}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={style.cancelBtn} onPress={onClose} disabled={!!busyKey}>
          <Text style={style.cancelText}>{t('common.cancel')}</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

export default PostActionsSheet;