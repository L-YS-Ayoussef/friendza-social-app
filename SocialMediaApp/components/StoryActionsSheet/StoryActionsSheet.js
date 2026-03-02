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
import { useThemeMode } from '../../context/ThemeContext';

const SHEET_HEIGHT = 260;

const StoryActionsSheet = ({
  visible,
  onClose,
  story,
  isOwner,
  isFollowingUser,
  onView,
  onDelete,
  onToggleFollow,
  showToast,
}) => {
  const { t, isRTL } = useT();
  const { colors } = useThemeMode();

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
        const next = await onToggleFollow?.();
        showToast?.(
          next ? t('post.nowFollowing', { username: story.username }) : t('post.unfollowed', { username: story.username })
        );
        onClose?.();
      });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[style.backdrop, { backgroundColor: colors.scrim }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          style.sheet,
          { transform: [{ translateY }], backgroundColor: colors.surface2, borderTopColor: colors.border },
        ]}
      >
        <View style={[style.sheetHandle, { backgroundColor: colors.border }]} />
        <Text style={[style.title, { color: colors.text }]}>{t('post.actionsTitle')}</Text>

        {actions.map((a) => (
          <TouchableOpacity
            key={a.key}
            style={[style.row, { borderBottomColor: colors.border }, a.danger && style.rowDanger]}
            onPress={() => handlePress(a.key)}
            disabled={!!busyKey}
          >
            <View style={[style.rowLeft, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <FontAwesomeIcon icon={a.icon} size={18} color={a.danger ? colors.error : colors.icon} />
              <Text style={[style.rowText, { color: colors.text }, a.danger && { color: colors.error }]}>
                {a.label}
              </Text>
            </View>

            {busyKey === a.key ? <ActivityIndicator color={colors.primary} /> : null}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[style.cancelBtn, { backgroundColor: colors.surface1 }]}
          onPress={onClose}
          disabled={!!busyKey}
        >
          <Text style={[style.cancelText, { color: colors.text }]}>{t('common.cancel')}</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

export default StoryActionsSheet;