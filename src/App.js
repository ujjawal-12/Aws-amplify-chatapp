import React, { useEffect, useReducer } from "react";
import "./App.css";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import { DataStore, Predicates } from "@aws-amplify/datastore";
import "@aws-amplify/ui-react/styles.css";
import { Chatty } from "./models";
import moment from "moment";
import img1 from "./images/amplify.jpeg";

const initialState = {
  username: "",
  messages: [],
  message: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "setUser":
      return { ...state, username: action.username };
    case "set":
      return { ...state, messages: action.messages };
    case "updateInput":
      return { ...state, [action.inputValue]: action.value };
    case "deleteallmessage":
      return { ...state, messages: [action.deletemsg] };
    default:
      return state
  }
}

async function getMessages(dispatch) {
  try {
    const messagesData = await DataStore.query(Chatty, Predicates.ALL);
    dispatch({ type: "set", messages: [...messagesData] });
  } catch (err) {
    console.log("error fetching messages...", err);
  }
}

async function createMessage(state, dispatch) {
  if (state.message === "") return;
  try {
    await DataStore.save(
      new Chatty({
        user: state.username,
        message: state.message,
        createdAt: new Date().toISOString(),
      })
    );
    state.message = "";
    getMessages(dispatch);
  } catch (err) {
    console.log("error creating message...", err);
  }
}

async function deleteallmssge(dispatch) {
  try {
    const deletemsg = await DataStore.delete(Chatty, Predicates.ALL);
    dispatch({ type: "deleteallmessage", deletemsg });
    getMessages(dispatch);
  } catch (err) {
    console.log("error creating message...", err);
  }
}

function updater(value, inputValue, dispatch) {
  dispatch({ type: "updateInput", value, inputValue });
}

function App({ signOut }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    Auth.currentAuthenticatedUser().then((user) => {
      dispatch({ type: "setUser", username: user.username });
    });
    getMessages(dispatch);
    const subscription = DataStore.observe(Chatty).subscribe((msg) => {
      console.log(msg.model, msg.opType, msg.element);
      getMessages(dispatch);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="app">
      {console.log(state.username)}
      <div>
        <div
          style={{
            textAlign: "center",
            border: "1px solid black",
            backgroundColor: "black",
          }}
        >
          <img src={img1} width="400" height={230} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginRight: "35px",
          }}
        >
          <p
            style={{
              textAlign: "center",
              marginLeft: "150px",
              fontSize: "25px",
            }}
          >
            <b>User</b> :{" "}
            <span style={{ color: "teal" }}>{state.username}</span>
          </p>
          <button
            style={{
              padding: "5px",
              backgroundColor: "red",
              color: "white",
              borderRadius: "5px",
              fontSize: "20px",
              marginRight: "130px",
            }}
            onClick={signOut}
          >
            Sign out
          </button>
        </div>
        <div
          style={{
            backgroundColor: "rgba(218, 218, 211, 0.979)",
            minHeight: "380px",
            maxHeight: "auto",
            marginLeft: "150px",
            marginRight: "150px",
            paddingTop: "15px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ width: "70%", textAlign: "center" }}>
              <input
                type="text"
                placeholder="Enter your message..."
                style={{ width: "750px", padding: "11px", fontSize: "20px" }}
                onChange={(e) => updater(e.target.value, "message", dispatch)}
                value={state.message}
              />
            </div>
            <div style={{ width: "30%", textAlign: "start" }}>
              <button
                onClick={() => createMessage(state, dispatch)}
                style={{
                  backgroundColor: "green",
                  color: "white",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  fontSize: "20px",
                  marginLeft: "25px",
                  marginRight: "25px",
                }}
              >
                Send
              </button>
              <button
                onClick={() => deleteallmssge(dispatch)}
                style={{
                  backgroundColor: "rgb(228, 204, 72)",
                  color: "black",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  fontSize: "20px",
                }}
              >
                Delete All
              </button>
            </div>
          </div>
          <div style={{ margin: "20px", paddingBottom: "20px" }}>
            {state.messages.map((message, index) => {
              return message.user === state.username ? (
                <div style={{ textAlign: "end" }}>
                  <div
                    key={message.id}
                    style={{
                      minHeight: "80px",
                      maxHeight: "auto",
                      backgroundColor: "white",
                      minWidth: "250px",
                      borderRadius: "5px",
                      maxWidth: "450px",
                      wordWrap: "break-word",
                      display: "inline-block",
                      padding: "10px",
                      marginTop: "10px",
                      marginLeft: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                          textAlign: "start",
                          fontSize: "18px",
                          color: "rgba(207, 95, 60, 0.979)",
                        }}
                      >
                        <b> {message.user}</b>
                      </div>
                      <div
                        style={{
                          width: "50%",
                          textAlign: "end",
                          fontSize: "18px",
                        }}
                      >
                        {" "}
                        <b>{moment(message.createdAt).format("HH:mm:ss")}</b>
                      </div>
                    </div>
                    <div style={{ paddingTop: "10px" }}>{message.message}</div>
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    key={message.id}
                    style={{
                      minHeight: "80px",
                      maxHeight: "auto",
                      backgroundColor: "white",
                      minWidth: "250px",
                      borderRadius: "5px",
                      maxWidth: "450px",
                      wordWrap: "break-word",
                      display: "inline-block",
                      padding: "10px",
                      marginTop: "10px",
                      marginLeft: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                          textAlign: "start",
                          fontSize: "18px",
                          color: "rgba(207, 95, 60, 0.979)",
                        }}
                      >
                        <b> {message.user}</b>
                      </div>
                      <div
                        style={{
                          width: "50%",
                          textAlign: "end",
                          fontSize: "18px",
                        }}
                      >
                        {" "}
                        <b>{moment(message.createdAt).format("HH:mm:ss")}</b>
                      </div>
                    </div>
                    <div style={{ paddingTop: "10px" }}>{message.message}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
