import { Dimensions } from "react-native";
import { showMessage } from "react-native-flash-message";
import { colors } from "../theme/colors";


const showToast = (message: string, type: "normal" | "success" | "warning" | "danger"): void => {
  const { width } = Dimensions.get('window');
  const horizontalOffset = (width - (width * 0.9)) / 2;

  const backgroundColor =
    type === "danger"
      ? "rgba(255, 23, 10, 0.6)"
      : type === "warning"
        ? "rgba(255, 149, 0, 0.6)"
        : type === "success"
          ? colors.success
          : type || "rgba(0, 0, 0, 0.6)";

  showMessage({
    message,
    backgroundColor,
    color: colors.white,
    floating: true,
    titleStyle: { textAlign: 'center' },
    style: { width: '90%' },
    position: { bottom: 25, left: horizontalOffset }
  })
};

const logError = (error: any) => {
  console.log(error);
};


export {
  showToast,
  logError
}