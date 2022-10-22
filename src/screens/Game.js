import React, {useState, useEffect} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  Text,
  View,
  Pressable,
  Alert,
  Button,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {emptyMap} from '../utils';
import {getWinner, isTie} from '../utils/gameLogic';
import {botTurn} from '../utils/bot';
import {styles} from '../../App.style';

export default Game = () => {
  const [map, setMap] = useState(emptyMap);
  const [ourPlayerType, setOurPlayerType] = useState(null);
  const [currentTurn, setCurrentTurn] = useState('X');

  const [gameMode, setGameMode] = useState('BOT_EASY'); // 1v1, BOT_EASY, BOT_MEDIUM;
  const [data, setData] = useState([]);
  const [gameId, setGameId] = useState('');

  useEffect(() => {
    resetGame();
    if (gameMode == 'ONLINE') {
      console.log(data.toString());
      console.log(Object.values(data).toString());
      console.log(data);
      findOrCreateOnlineGame();
    } else {
      deleteTemporaryGame();
    }
    setCurrentTurn('X');
    if (gameMode !== 'ONLINE') {
      setOurPlayerType('X');
    }
  }, [gameMode]);

  const navigation = useNavigation();

  useEffect(() => {
    if (currentTurn == 'O' && ['BOT_EASY', 'BOT_MEDIUM'].includes(gameMode)) {
      const chosenOption = botTurn(map, gameMode);
      if (chosenOption) {
        onPress(chosenOption.row, chosenOption.col);
      }
    }
  }, [currentTurn, gameMode]);

  useEffect(() => {
    if (!data) {
      return;
    }
    // update game map and turn
    if (gameMode == 'ONLINE' && gameId) {
      database()
        .ref('Game/' + `${gameId}`)
        .update({
          currentPlayer: currentTurn,
          map: JSON.stringify(map),
        }
        );
    }
  }, [currentTurn, gameMode]);

  useEffect(() => {
    const winner = getWinner(map);
    if (winner) {
      gameWon(winner);
    } else {
      checkTieState();
    }

    //update game map
  }, [map]);

  var getData = item => {
    return [item].join(' ');
  };

   useEffect(() => {
     database()
       .ref('Game/')
       .on('value', snapshot => {
         const response = snapshot.val()
         const newArr = Object.keys(response).map(key => {
           response[key].id = key;
           return response[key];
         });
         setData(newArr);
         // console.log("bu mudur? ", Object.values(newArr.pop())[2]);
       });
   },[]);

  const findOrCreateOnlineGame = async () => {
    //Search for available game that doesn't have the second player
    const games = await getAvailableGames();

    if (games.length > 0) {
      var stringGameId = Object.values(data)[2];
      console.log(stringGameId);
      setGameId(stringGameId);
      typeof gameId;
      joinGame(games);
    } else {
      await createNewGame();
    }
    // if no existing game are found, create a new one and wait for the opponent
  };

  const joinGame = async game => {
    if (data) {
      await database()
        .ref('Game/' + `${gameId}`)
        .update({playerO: user.uid})
        .then(console.log('updated! =', user.uid));

      setOurPlayerType('O');
      setCurrentTurn(Object.values(data[0].currentPlayer));
      // *************************
    }
  };

  const getAvailableGames = async () => {
    await database()
      .ref('Game/')
      .on('value', snapshot => {
        const response = snapshot.val();
        const newArr = Object.keys(response).map(key => {
          response[key].id = key;
          return response[key];
        });
        setData(newArr);
      });

    return data;
  };

  const createNewGame = async () => {
    const emptyStringMap = JSON.stringify([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
    var currentTime = Date.now();
    const createdGame = await database()
      .ref('Game/' + currentTime)
      .set({
        playerX: user.uid,
        map: emptyStringMap,
        currentPlayer: 'X',
        pointsX: 0,
        pointsO: 0,
        id: currentTime,
      });
    setOurPlayerType('X');
    setGameId(currentTime);
  };

  const deleteTemporaryGame = async () => {
    if (!data || Object.keys(data).playerO) {
      return;
    }
    await database()
      .ref('Game/' + gameId)
      .set('');
  };

  const onPress = (rowIndex, columnIndex) => {
    if (gameMode === 'ONLINE' && currentTurn !== ourPlayerType) {
      Alert.alert('Not your turn');
      console.log(ourPlayerType);
      return;
    }

    if (map[rowIndex][columnIndex] !== '') {
      Alert.alert('Position already occupied');
      return;
    }

    setMap(existingMap => {
      const updatedMap = [...existingMap];
      updatedMap[rowIndex][columnIndex] = currentTurn;
      return updatedMap;
    });

    setCurrentTurn(currentTurn == 'X' ? 'O' : 'X');
  };

  const checkTieState = () => {
    if (isTie(map)) {
      Alert.alert(`It's a tie`, `tie`, [
        {
          text: 'Restart',
          onPress: resetGame,
        },
      ]);
    }
  };

  const [score, setScore] = useState();
  const myAuth = auth();
  const user = myAuth.currentUser;

  useEffect(() => {
    database()
      .ref('scores/' + user.uid)
      .on('value', snapshot => {
        const myData = snapshot.val();
        setScore(myData.score);
      });
  }, [user.uid]);

  const scored = () => {
    database()
      .ref('scores/' + user.uid)
      .update({
        score: score,
      })
      .then(console.log('updated! =', score));
  };

  const gameWon = player => {
    if (player == 'X') {
      Alert.alert(`Win `, `Player ${player} won`, [
        {
          text: 'Restart',
          onPress: resetGame,
        },
        setScore(score + 1),
        scored(),
      ]);
    }
    if (player == 'O') {
      Alert.alert(`Win `, `Player ${player} won`, [
        {
          text: 'Restart',
          onPress: resetGame,
        },
      ]);
    }
  };

  const resetGame = () => {
    setMap([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
    setCurrentTurn('X');
  };

  return (
    <SafeAreaView style={styles.background}>
      <ImageBackground
        source={require('../../assets/bg.jpeg')}
        style={styles.bg}
        resizeMode="contain">
        <TouchableOpacity style={{position: 'absolute', top: 30, left: 0}}>
          <Text style={styles.button} onPress={navigation.goBack}>
            Go Back To Home Screen
          </Text>
        </TouchableOpacity>
        <View style={{position: 'absolute', bottom: 180}}>
          <Button title="Reset" onPress={resetGame}></Button>
        </View>
        <Text
          style={{
            position: 'absolute',
            fontSize: 24,
            color: 'white',
            marginBottom: 'auto',
            marginTop: 30,
            top: 75,
          }}>
          Email: {auth().currentUser?.email} {'\n'}
          Score: {score}
        </Text>
        <Text
          style={{
            position: 'absolute',
            fontSize: 24,
            color: 'white',
            marginBottom: 'auto',
            marginTop: 50,
            top: 120,
          }}>
          Current Turn: {currentTurn} {'\n'}
          {data?.length > 0 && gameMode == 'ONLINE' && <Text>Game id: {gameId}</Text>}
        </Text>
        <View style={styles.map}>
          {map.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((cell, columnIndex) => (
                <Pressable
                  key={`row-${rowIndex}-col-${columnIndex}`}
                  onPress={() => onPress(rowIndex, columnIndex)}
                  style={styles.cell}>
                  {cell == 'O' && <View style={styles.circle} />}
                  {cell == 'X' && (
                    <View style={styles.cross}>
                      <View style={styles.crossLine} />
                      <View
                        style={[styles.crossLine, styles.crossLineReversed]}
                      />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.buttons}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
            <Text
              onPress={() => setGameMode('1v1')}
              style={[
                styles.button,
                {backgroundColor: gameMode == '1v1' ? '#4F5686' : '#191F24'},
              ]}>
              1v1
            </Text>
            <Text
              onPress={() => setGameMode('BOT_EASY')}
              style={[
                styles.button,
                {
                  backgroundColor:
                    gameMode == 'BOT_EASY' ? '#4F5686' : '#191F24',
                },
              ]}>
              East Bot
            </Text>
            <Text
              onPress={() => setGameMode('BOT_MEDIUM')}
              style={[
                styles.button,
                {
                  backgroundColor:
                    gameMode == 'BOT_MEDIUM' ? '#4F5686' : '#191F24',
                },
              ]}>
              Medium Bot
            </Text>
            <Text
              onPress={() => [setGameMode('ONLINE'), getAvailableGames()]}
              style={[
                styles.button,
                {
                  backgroundColor: gameMode == 'ONLINE' ? '#4F5686' : '#191F24',
                },
              ]}>
              ONLINE
            </Text>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
