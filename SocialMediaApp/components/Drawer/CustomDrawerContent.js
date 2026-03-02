import React from 'react';
import { View } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import useT from '../../i18n/useT';
import { useThemeMode } from '../../context/ThemeContext';

const CustomDrawerContent = (props) => {
  const { signOut } = useAuth();
  const { t } = useT();
  const { colors } = useThemeMode();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: colors.background }}
      >
        <DrawerItemList
          {...props}
          // active/hover colors
          activeTintColor={colors.primary}
          inactiveTintColor={colors.icon}
          activeBackgroundColor={colors.surface1}
          inactiveBackgroundColor="transparent"
          labelStyle={{ color: colors.text }}
        />
      </DrawerContentScrollView>

      <View style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingBottom: 12 }}>
        <DrawerItem
          label={t('common.logout')}
          onPress={signOut}
          inactiveTintColor={colors.icon}
          activeTintColor={colors.primary}
          icon={({ color, size }) => (
            <FontAwesomeIcon icon={faSignOutAlt} color={color} size={size} />
          )}
          labelStyle={{ color: colors.text }}
        />
      </View>
    </View>
  );
};

export default CustomDrawerContent;