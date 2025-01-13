import { ProgressBar, Colors } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

export default function BarreTrajet() {
    
    const princesse = () => {
        return <ProgressBar progress={undefined}  style={styles.container}/>;
    };

    return <View>{princesse()}</View>;
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        height: 4
    },
});
