import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { RoomType } from '../utils/Types'

const Play = () => {
    const { authTokens } = useContext(AuthContext);
    const [room, setRoom] = useState<string>('');
    const [rooms, setRooms] = useState<RoomType[]>([]);
    const [serverName, setServerName] = useState<string>('HoChiMinh');
    const [serverSocket, setServerSocket] = useState<WebSocket | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        getRooms();
    }, []);

    useEffect(() => {
        console.log('rooms', rooms);
    }, [rooms]);

    const updateRoomList = (roomList: RoomType[]) => {
        setRooms(() => roomList);
    }

    const handleMessage = (e: MessageEvent) => {
        const data = JSON.parse(e.data);
        console.log('Data:', data);

        if (data.type === 'room_list') {
            console.log('room list', data.message);
            updateRoomList(data.message);
        }
    }

    useEffect(() => {
        if (serverSocket) {
            serverSocket.close();
        }

        connectToServer(serverName);
    }, [serverName]);

    const connectToServer = (serverName: string): void => {
        const url = `${process.env.REACT_APP_SOCKET_DOMAIN}ws/server/${serverName}/`;
        const server_socket = new WebSocket(
            url + '?token=' + authTokens.access
        );

        server_socket.onopen = () => {
            console.log('connected to server');
        };

        server_socket.onmessage = handleMessage;

        server_socket.onclose = (e) => {
            console.log('disconnected from server');
        }

        server_socket.onerror = (e) => {
            console.error('server socket error');
        }

        setServerSocket(server_socket);
    };

    // close server socket when component unmounts
    useEffect(() => {
        return () => {
            if (serverSocket) {
                serverSocket.close();
            }
        }
    }, [serverSocket]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (room.length === 0) {
            alert('room name cannot be empty');
            return;
        }

        try {
            await createRoom(room);
            if (serverSocket) {
                serverSocket.send(JSON.stringify({
                    'type': 'create-room',
                    'message': room,
                }));
            }
            navigate(`/play-vs-human?room=${serverName}_${room}`);
        } catch (error) {
            console.log(error);
        }

        setRoom('');
    }

    const createRoom = async (roomName: string) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}api/room/create-room`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens.access}`
            },
            body: JSON.stringify({
                name: roomName,
                slug: serverName + '_' + roomName,
            })
        });
        const data = await response.json();
        console.log(data);

        if (data.error) {
            alert(data.error);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoom(e.target.value);
    }

    const getRooms = async () => {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}api/room/all-rooms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens.access}`
            },
            body: JSON.stringify({
                server_name: serverName,
            })
        });
        let data = await response.json();
        setRooms(data);
    }

    return (
        <StyledPlay>
            <div className="create-room">
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Room" onChange={handleChange} />
                    <button type="submit">Create room</button>
                </form>
            </div>
            <div className="all-room">
                <div className='rooms-container'>
                    {rooms.map((room) => (
                        <div className='room-card' key={room.id}>
                            <a href={`/play-vs-human?room=${room.slug}`}>
                                {room.name}
                            </a>
                            {/* <p>{room.name}</p> */}
                            {/* <p>{room.name}</p> */}
                        </div>
                    ))}
                </div>
            </div>
        </StyledPlay>
    )
};

const StyledPlay = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
    height: 100%;

    .create-room {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        height: 10vh;
    }

    .all-room {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        height: 90vh;
        width: 100%;
        overflow-y: scroll;

        .rooms-container {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            grid-gap: 1rem;

            .room-card {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background-color: skyblue;
                border-radius: 20px;
                box-shadow: 0 2px 2px 1px rgba(0, 0, 0, 0.1);
                width: 100%;
                
                transition: transform 0.3s cubic-bezier(0.374, 0.019, 0.035, 1.861);

                &:hover {
                    transform: scale(1.03);
                }
            }
        }
    }
`;

export default Play;