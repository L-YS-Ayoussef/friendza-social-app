import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Animated, Text } from 'react-native';
import style from './style';

const BottomToast = forwardRef((props, ref) => {
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    show: (msg, duration = 2600) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      setMessage(String(msg || ''));
      setMounted(true);

      Animated.timing(anim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();

      timerRef.current = setTimeout(() => {
        Animated.timing(anim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) setMounted(false);
        });
      }, duration);
    },
  }));

  if (!mounted) return null;

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <Animated.View style={[style.toast, { opacity: anim, transform: [{ translateY }] }]}>
      <Text style={style.toastText}>{message}</Text>
    </Animated.View>
  );
});

export default BottomToast;