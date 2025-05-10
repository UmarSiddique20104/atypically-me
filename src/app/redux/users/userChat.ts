import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { io, type Socket } from "socket.io-client";
import { BASE_URL } from "@/app/components/ApiRoutes/apiRoutes";
import type { User } from "@/app/(pages)/(users)/(Dashboard)/community/Community";

// Define the shape of the state
interface SocketState {
  socket: Socket | null;
  chatData: User | null; // Assuming chatData is a User or null
}

// Initial state
const initialState: SocketState = {
  socket: null,
  chatData: null,
};

// Function to connect to the socket
const connectSocket = (): Promise<Socket> => {
  return new Promise((resolve) => {
    const socket = io(BASE_URL);
    socket.on("connect", () => resolve(socket));
  });
};

// Create async thunk for socket initialization
export const initializeSocket = createAsyncThunk<Socket, void>(
  "socket/initialize",
  async () => {
    return await connectSocket();
  }
);

// Create the slice
const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket(state, action: PayloadAction<Socket>) {
      //@ts-ignore
      state.socket = action.payload;
    },
    addChatData(state, action: PayloadAction<User>) {
      state.chatData = action.payload;
    },
    disconnectSocket(state) {
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeSocket.fulfilled, (state, action) => {
        //@ts-ignore
        state.socket = action.payload;
      });
  },
});

export const { setSocket, disconnectSocket, addChatData } = socketSlice.actions;
export default socketSlice.reducer;