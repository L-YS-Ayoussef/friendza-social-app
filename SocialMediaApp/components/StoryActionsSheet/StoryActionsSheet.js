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
import { faEye, faTrash, faUserPlus, faUserMinus } from '@fortawesome/free-solid-svg-icons';

import useT from '../../i18n/useT';
import style from '../PostActionsSheet/style';

const SHEET_HEIGHT = 260;

const StoryActionsSheet = ({
  visible,
  onClose,
  story, // { id, userId, username }
  isOwner,
  isFollowingUser,
  onView,
  onDelete,
  onToggleFollow,
  showToast,
}) => {
  const { t } = useT();
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
    if (!story) return [];

    if (isOwner) {
      return [
        { key: 'view', label: t('common.view'), icon: faEye },
        { key: 'delete', label: t('common.delete'), icon: faTrash, danger: true },
      ];
    }

    return [
      {
        key: 'follow',
        label: isFollowingUser ? t('common.unfollow') : t('common.follow'),
        icon: isFollowingUser ? faUserMinus : faUserPlus,
      },
      { key: 'view', label: t('common.view'), icon: faEye },
    ];
  }, [story, isOwner, isFollowingUser, t]);

  const run = async (key, fn) => {
    if (busyKey) return;
    try {
      setBusyKey(key);
      await fn();
    } finally {
      setBusyKey(null);
    }
  };

  const handlePress = (key) => {
    if (!story) return;

    if (key === 'view') {
      onClose?.();
      onView?.();
      return;
    }

    if (key === 'delete') {
      Alert.alert(t('common.delete'), t('story.deleteConfirm'), [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () =>
            run('delete', async () => {
              await onDelete?.();
              showToast?.(t('story.deletedOk'));
              onClose?.();
            }),
        },
      ]);
      return;
    }

    if (key === 'follow') {
      run('follow', async () => {
        const next = await onToggleFollow?.(); // boolean
        showToast?.(next ? t('post.nowFollowing', { username: story.username }) : t('post.unfollowed', { username: story.username }));
        onClose?.();
      });
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
            <View style={style.rowLeft}>
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

export default StoryActionsSheet;