import React, { useEffect, useRef, useState } from 'react';
import { db, auth } from '../Services/firebaseConfig'; 
import { collection, getDocs, addDoc, setDoc, doc } from 'firebase/firestore'; 
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'; 
import '../css/SuperChat.css';

const SuperChat = () => {
    const [messages, setMessages] = useState([]); 
    const [input, setInput] = useState(''); 
    const [contacts, setContacts] = useState([]); 
    const [selectedContact, setSelectedContact] = useState(null); 
    const [user, setUser] = useState(null); 
    const messageEndRef = useRef(null); // Referência para o final da lista de mensagens

    const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user); 

            const userRef = doc(db, 'users', result.user.uid);
            await setDoc(userRef, {
                displayName: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL
            });
        } catch (error) {
            console.error("Erro ao fazer login:", error);
        }
    };

    const fetchUsers = async () => {
        const usersCollectionRef = collection(db, 'users');
        try {
            const usersSnapshot = await getDocs(usersCollectionRef);
            const usersList = usersSnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(userItem => userItem.email !== user?.email);
            setContacts(usersList);
        } catch (error) {
            console.error("Erro ao buscar usuários: ", error);
        }
    };

    const fetchMessages = async () => {
        const chatsCollectionRef = collection(db, 'chats'); 
        try {
            const messagesSnapshot = await getDocs(chatsCollectionRef);
            const messagesList = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(messagesList); 
        } catch (error) {
            console.error("Erro ao buscar mensagens: ", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUsers(); 
        }
        fetchMessages(); 
    }, [user]);

    // Rolar para a última mensagem
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        // Adiciona a nova mensagem ao Firestore
        await addDoc(collection(db, 'chats'), {
            text: input,
            sender: user.email,
            receiver: selectedContact,
            timestamp: new Date() // Adiciona o timestamp
        });
        setInput('');
        fetchMessages(); 
    };

    const handleLogout = async () => {
        await signOut(auth);
        setUser(null); 
        setContacts([]); 
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <div className="sidebar">
                {!user ? (
                    <div>
                        <button onClick={handleLogin} style={{ marginTop: '20px' }}>Login com Google</button>
                    </div>
                ) : (
                    <>
                        <div className="user-info">
                            <img src={user.photoURL || "path_to_user_image"} alt="User" className="user-avatar" />
                            <h3>{user.displayName || user.email}</h3>
                        </div>
                        <h4>Contatos:</h4>
                        {contacts.map(contact => (
                            <div key={contact.id} onClick={() => setSelectedContact(contact.email)} className="contact-item">
                                <img src={contact.photoURL} alt={contact.displayName} className="contact-avatar" />
                                {contact.displayName || contact.email}
                            </div>
                        ))}
                        <button onClick={handleLogout} style={{ marginTop: '20px' }}>Logout</button>
                    </>
                )}
            </div>

            {/* Chat Area */}
            <div className="chat-area">
                <div className="message-list">
                    <h2>Mensagens:</h2>
                    {selectedContact ? (
                        <>
                            {messages
                                .filter(msg => (msg.sender === user?.email && msg.receiver === selectedContact) || (msg.sender === selectedContact && msg.receiver === user?.email))
                                .sort((a, b) => a.timestamp - b.timestamp)
                                .map((msg) => (
                                    <div key={msg.id} className={msg.sender === user?.email ? 'message-sent' : 'message-received'}>
                                        {msg.text}
                                    </div>
                                ))}
                            <div ref={messageEndRef} /> {/* Div para scroll automático */}
                        </>
                    ) : (
                        <p>Selecione um contato para conversar.</p>
                    )}
                </div>
                {user && (
                    <form onSubmit={handleSendMessage} className="message-input-container">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Digite sua mensagem..."
                        />
                        <button type="submit">Enviar</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SuperChat;
