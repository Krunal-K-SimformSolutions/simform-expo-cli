# Custom Text

All params are optional and works mostly independently.

### Basic Text with default props

```
  <CustomText>
    {StringConst.Auth.register}
  </CustomText>
```

### Text with variant

There are provided a lots of variant with font family and font size combination. some are listed below.
Font sizes are 14 and 16
Font family are medium and semiBold

1. **semiBold16** -> Apply semiBold font family with 16 font size
2. **medium14** -> Apply medium font family with 14 font size
   etc...

```
  <CustomText variant="semiBold16">
    {StringConst.Auth.register}
  </CustomText>
```

### Others

This gives you the ability to apply own style, text color and other which is supported to [Text](https://reactnative.dev/docs/0.73/text#props).

```
  <CustomText
    style={styles.registerText}
    variant="medium14"
    onPress={() => {
      console.log('---REGISTER--');
    }}>
    {StringConst.Auth.register}
  </CustomText>
```
