import React from "react";
import "./style.css";
import { nanoid } from "nanoid";

export default function Die(props) {
  const faces = [
    [<div key={nanoid()} className="dot center middle"></div>],

    [
      <div key={nanoid()} className="dot top right"></div>,
      <div key={nanoid()} className="dot bottom left"></div>,
    ],

    [
      <div key={nanoid()} className="dot top right"></div>,
      <div key={nanoid()} className="dot center middle"></div>,
      <div key={nanoid()} className="dot bottom left"></div>,
    ],

    [
      <div key={nanoid()} className="dot top left"></div>,
      <div key={nanoid()} className="dot top right"></div>,
      <div key={nanoid()} className="dot bottom left"></div>,
      <div key={nanoid()} className="dot bottom right"></div>,
    ],

    [
      <div key={nanoid()} className="dot top left"></div>,
      <div key={nanoid()} className="dot top right"></div>,
      <div key={nanoid()} className="dot center middle"></div>,
      <div key={nanoid()} className="dot bottom left"></div>,
      <div key={nanoid()} className="dot bottom right"></div>,
    ],

    [
      <div key={nanoid()} className="dot top left"></div>,
      <div key={nanoid()} className="dot top right"></div>,
      <div key={nanoid()} className="dot center left"></div>,
      <div key={nanoid()} className="dot center right"></div>,
      <div key={nanoid()} className="dot bottom left"></div>,
      <div key={nanoid()} className="dot bottom right"></div>,
    ],
  ];
  let face = faces[props.value - 1];
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "white",
  };
  return (
    <div
      style={styles}
      onClick={props.holdDice}
      className={props.isHeld === true ? "dice held" : "dice"}
    >
      {face}
    </div>
  );
}
