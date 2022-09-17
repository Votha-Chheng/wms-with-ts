import { StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect } from 'react'
import { Button } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { getCameraPermission } from '../store/slices/cameraPermission'

const LaunchCam: FC = () => {

  const {cameraStatus} = useSelector((state: RootState) => state.cameraPermission)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(()=>{
    dispatch(getCameraPermission())
  }, [cameraStatus])

  return (
    <View style={[styles.launchCamera]}>
      <Button icon="barcode-scan" mode="contained" color='whitesmoke' onPress={getCameraPermission}>
        Lancer le scanner
      </Button>
    </View>
  )
}

export default LaunchCam

const styles = StyleSheet.create({
  launchCamera : {
    flex: 1,
    justifyContent : 'center',
    backgroundColor: '#11e48f',
    alignItems : 'center',
    width:"100%",
    height : "100%"
  }
})