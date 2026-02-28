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

const CustomDrawerContent = (props) => {
  const { signOut } = useAuth();
  const { t } = useT();

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={{ borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingBottom: 12 }}>
        <DrawerItem
          label={t('common.logout')}
          onPress={signOut}
          icon={({ color, size }) => (
            <FontAwesomeIcon icon={faSignOutAlt} color={color} size={size} />
          )}
        />
      </View>
    </View>
  );
};

export default CustomDrawerContent;