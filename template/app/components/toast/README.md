# Toast

All params are optional and works mostly singleton.

### Configuration

Add toast component in app level, initialize reference in holder class and clear toast in unmount.

```
  <Toast ref={(ref) => ToastHolder.setToast(ref)} />
```

```
  useEffect(() => {
    return () => {
      ToastHolder.clearToast();
    };
  }, []);

```

### Any place show toast message

```
  ToastHolder.toastMessage({
    type: ToastType.success,
    message: 'Login Successfully'
  })
```

### Any place show toast messages

here show message one by one until all messages are not completed and if in between any place call toast message and it's also add to queue.

```
  ToastHolder.toastMessages([
    {
      type: ToastType.success,
      message: 'Login Successfully'
    },
    {
      type: ToastType.fail,
      message: 'User authentication failure'
    },
    {
      type: ToastType.warning,
      title: 'User Authentication',
      message: 'Your authentication expire in soon',
      interval: 3000
    }
  ])
```

### Any place close toast

```
  ToastHolder.closeToast()
```

### Others

This gives you the ability to apply translucent, numberOfLines show in message text and position of toast.
toastPosition are top or bottom

```
  <Toast
    translucent
    numberOfLines={2}
    toastPosition={'top'}
    ref={(ref) => ToastHolder.setToast(ref)} />
```
