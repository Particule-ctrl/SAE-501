import QRCode from 'react-native-qrcode-svg';
import { Alert } from 'react-native';

export default function QRCodeTrajet({ id }) {

    return <QRCode value={id} size={200} />;
}