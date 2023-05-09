import React, { Component, useEffect, useState } from "react";
import {
  Switch,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
import * as Animatable from "react-native-animatable";
import Collapsible from "react-native-collapsible";
import Accordion from "react-native-collapsible/Accordion";
import instance from "../axios.config";
import { ModuleScreen } from "../components/ModuleLayout";

const HomeScreen = ({ navigation }) => {
  return <ModuleScreen navigation={navigation}></ModuleScreen>;
};

export default HomeScreen;
