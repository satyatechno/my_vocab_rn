import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {DEVICE_WIDTH} from 'src/helper/helper';
import AllVocab from 'src/screens/Quiz/AllVocab';
import EditWord from 'src/screens/Quiz/EditWord';
import Notes from 'src/screens/Quiz/Notes';
import PlayQuiz from 'src/screens/Quiz/PlayQuiz';
import Quiz from 'src/screens/Quiz/Quiz';
import RandomVocab from 'src/screens/Quiz/RandomVocab';
import Vocab from 'src/screens/Quiz/Vocab';
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const ListStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="AllVocab" component={AllVocab} />
      <Stack.Screen name="EditWord" component={EditWord} />
    </Stack.Navigator>
  );
};

const NotesStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Notes" component={Notes} />
      <Stack.Screen name="random" component={RandomVocab} />
    </Stack.Navigator>
  );
};

const QuizStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Quiz" component={Quiz} />
      <Stack.Screen name="PlayQuiz" component={PlayQuiz} />
    </Stack.Navigator>
  );
};

const DrawerQuiz = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: DEVICE_WIDTH,
        },
      }}
      // drawerContent={props => <DrawerComponent {...props} />}
    >
      <Drawer.Screen
        name="Vocab"
        component={Vocab}
        options={{drawerLabel: 'Your Vocab'}}
      />
      <Drawer.Screen
        name="ListVocab"
        component={ListStack}
        options={{drawerLabel: 'All Vocabulary'}}
      />
      <Drawer.Screen
        name="QuizStack"
        component={QuizStack}
        options={{drawerLabel: 'Play Quiz'}}
      />
      <Drawer.Screen
        name="randomVocab"
        component={NotesStack}
        options={{drawerLabel: 'Random Vocab'}}
      />
      {/* <Drawer.Screen
        name="notes"
        component={Notes}
        options={{drawerLabel: 'Notes'}}
      /> */}
    </Drawer.Navigator>
  );
};

export default DrawerQuiz;
