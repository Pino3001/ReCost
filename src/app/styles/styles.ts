import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0.9, 0.2, 0.3, 0.6)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textDescrip: {
    fontFamily: "Sanches-Regular",
    fontSize: 14,
    textAlign: "center",
    color: "grey",
  },
  inputModal: {
    alignSelf: "center",
    height: 40,
    margin: 5,
    borderWidth: 1,
    padding: 10,
    width: "100%",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
  halfWidth: {
    width: "48%",
    marginLeft: 0,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
});

export default globalStyles;
