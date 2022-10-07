// import React from 'react';
// import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
// import {useSelector} from 'react-redux';
// import {DEVICE_WIDTH, findHeight, findSize} from 'src/helper/helper';
// import colors from 'src/styles/colors/colors';
// import fonts from 'src/styles/texts/fonts';
// import CustomButton from '../customButton/CustomButton';
// import ImageComponent from '../ImageComponent/ImageComponent';

// const DrawerComponent = ({navigation}) => {
//   const primaryAddress = useSelector(
//     state => state?.userReducer?.primaryAddress,
//   );
//   const user = useSelector(state => state?.userReducer?.user);
//   const skipLogin = useSelector(state => state?.userReducer?.skipLogin);
//   const LIST_DATA = [
//     {
//       id: 7,
//       heading: 'Your Vocab',
//       subHeading: 'Explore U-Rest',
//       image: require('src/assets/images/home.svg'),
//       screen: 'Vocab',
//       visible: true,
//     },
//     {
//       id: 1,
//       heading: 'All Vocab',
//       subHeading: 'Your recent bookings',
//       image: require('src/assets/images/checkbox.svg'),
//       screen: 'AllVocab',
//       visible: true,
//     },
//     {
//       id: 2,
//       heading: 'Play Quiz',
//       subHeading: 'Learn more about our services',
//       image: require('src/assets/images/settings.svg'),
//       screen: 'PlayQuiz',
//       visible: true,
//     },
//   ];
//   const handleClick = item => {
//     switch (item?.id) {
//       case 1:
//         navigation?.navigate(item?.screen);
//         break;
//       case 2:
//         navigation?.navigate(item?.screen);
//         break;
//       case 3:
//         navigation?.navigate(item?.screen);
//         break;
//       case 4:
//         navigation?.navigate(item?.screen);
//         break;
//       case 5:
//         navigation?.navigate(item?.screen, {
//           url: 'http://bedrock.pzdev.tk/privacy_policy',
//         });
//         break;
//       case 6:
//         navigation?.navigate(item?.screen);
//         break;
//       case 7:
//         navigation?.navigate(item?.screen);
//         break;
//       default:
//     }
//   };
//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <View style={styles.header}>
//         <CustomButton
//           onPress={() => {
//             navigation?.closeDrawer();
//           }}>
//           <Image
//             source={require('src/assets/images/back-arrow.svg')}
//             style={{backgroundColor: colors.defaultWhite}}
//           />
//         </CustomButton>
//       </View>
//       <View style={styles.container}>
//         <Text numberOfLines={1} style={styles.userName}>
//           {user?.name ?? 'Guest User'}
//         </Text>
//         {skipLogin ? (
//           <CustomButton
//             onPress={() => {
//               navigation?.navigate('Login');
//             }}
//             style={styles.locationContainer}>
//             <Image
//               style={styles.location}
//               source={require('src/assets/images/user.svg')}
//             />
//             <Text numberOfLines={1} style={styles.locationText}>
//               Sign in
//             </Text>
//           </CustomButton>
//         ) : (
//           <CustomButton
//             onPress={() => {
//               navigation?.navigate('AddressList');
//             }}
//             style={styles.locationContainer}>
//             <Image
//               style={[styles.location, {width: findSize(11)}]}
//               source={require('src/assets/images/location-fill.svg')}
//             />
//             <Text numberOfLines={1} style={styles.locationText}>
//               {primaryAddress !== undefined
//                 ? primaryAddress?.address
//                 : 'Set Your Address'}
//             </Text>
//           </CustomButton>
//         )}
//         <View style={{marginTop: findHeight(30)}}>
//           {LIST_DATA?.map(item => {
//             if (item?.visible)
//               return (
//                 <CustomButton
//                   key={item?.id?.toString()}
//                   onPress={() => handleClick(item)}
//                   style={{
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     marginVertical: findHeight(10),
//                   }}>
//                   <ImageComponent
//                     source={item?.image}
//                     style={{
//                       height: findHeight(35),
//                       width: findSize(35),
//                       tintColor: colors.themeColor,
//                     }}
//                     resizeMode="contain"
//                   />
//                   <View style={{paddingHorizontal: findSize(15)}}>
//                     <Text style={styles.heading}>{item?.heading}</Text>
//                     <Text style={styles.subHeading}>{item?.subHeading}</Text>
//                   </View>
//                 </CustomButton>
//               );
//           })}
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default DrawerComponent;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: colors.defaultWhite,
//     flex: 1,
//     padding: findSize(20),
//   },
//   header: {
//     backgroundColor: colors.defaultWhite,
//     paddingHorizontal: findHeight(15),
//     height: findHeight(60),
//     justifyContent: 'center',
//   },
//   userName: {
//     fontSize: findSize(43),
//     fontFamily: fonts.Montserrat_SemiBold,
//     color: colors.defaultBlack,
//     alignSelf: 'center',
//     marginVertical: findHeight(10),
//   },
//   locationContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//     borderWidth: 1,
//     borderColor: colors.themeColor,
//     borderRadius: findSize(20),
//     alignSelf: 'center',
//     padding: findSize(5),
//     paddingHorizontal: findSize(10),
//     marginVertical: findHeight(10),
//   },
//   location: {
//     height: findHeight(16),
//     width: findSize(15),
//     tintColor: colors?.themeColor,
//     marginHorizontal: 2,
//   },
//   locationText: {
//     color: colors.themeColor,
//     fontFamily: fonts.Montserrat_Medium,
//     fontSize: findSize(13),
//     maxWidth: DEVICE_WIDTH * 0.7,
//     marginLeft: 2,
//   },
//   heading: {
//     color: colors.defaultBlack,
//     fontFamily: fonts.Montserrat_SemiBold,
//     fontSize: findSize(20),
//   },
//   subHeading: {
//     color: colors.appGray,
//     fontFamily: fonts.Montserrat_Regular,
//     fontSize: findSize(14),
//   },
// });
