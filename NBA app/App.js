import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, ActivityIndicator } from 'react-native';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlayerStats, setSelectedPlayerStats] = useState(null);

  const searchPlayers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://www.balldontlie.io/api/v1/players?search=${searchQuery}`);
      const data = await response.json();
      setPlayers(data.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewStats = async (playerId) => {
    try {
      setLoading(true);
      const response = await fetch(`https://www.balldontlie.io/api/v1/players/${playerId}`);
      const data = await response.json();
      setSelectedPlayerStats(data);
    } catch (error) {
      console.error('Error fetching player stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{`${item.first_name} ${item.last_name}`}</Text>
      <Text>{`Position: ${item.position}`}</Text>
      <Text>{`Team: ${item.team.full_name}`}</Text>
      <Button title="View Stats" onPress={() => viewStats(item.id)} color="#007bff" />
    </View>
  );

  const renderStats = () => {
    if (loading) {
      return <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#0000ff" />;
    } else if (selectedPlayerStats) {
      return (
        <View style={{ marginTop: 20 }}>
          <Text>{`Height: ${selectedPlayerStats.height_feet}'${selectedPlayerStats.height_inches}"`}</Text>
          <Text>{`Weight: ${selectedPlayerStats.weight_pounds} lbs`}</Text>
          <Text>{`Position: ${selectedPlayerStats.position}`}</Text>
          <Text>{`City: ${selectedPlayerStats.team.city}`}</Text>
          <Text>{`Conference: ${selectedPlayerStats.team.conference}`}</Text>
          <Text>{`Division: ${selectedPlayerStats.team.division}`}</Text>
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, borderRadius: 5 }}
        placeholder="Search player..."
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />
      <Button title="Search" onPress={searchPlayers} color="#28a745" />
      <FlatList
        data={players}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        style={{ marginTop: 20 }}
      />
      {renderStats()}
    </View>
  );
};

export default App;