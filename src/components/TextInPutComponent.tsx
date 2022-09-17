import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import { TextInput } from 'react-native-paper'

type TextInPutComponentProps={
  setter: Function
  stateValue: string
  label: string
  keyBoard?: string
  textAffix?: string
}

const TextInPutComponent: FC<TextInPutComponentProps> = ({setter, stateValue, label, keyBoard, textAffix}: TextInPutComponentProps) => {
  return (
    <TextInput
      mode='outlined'
      label={label}
      value={stateValue}
      activeOutlineColor="#337171"
      outlineColor='#c4cfd4'
      onChangeText={text =>setter(text)}
      autoComplete="off"
      keyboardType={keyBoard === "numeric" ? "numeric" : keyBoard === "phone-pad" ? "phone-pad" : "default"}
      style={{marginBottom:15}}
      left={textAffix !==null ? <TextInput.Affix text={textAffix} />: null}
    />
  )
}

export default TextInPutComponent

TextInPutComponent.defaultProps = {
  keyBoard: null,
  textAffix : null
}

const styles = StyleSheet.create({})