import { useState } from 'react';
import { BrowserRouter as Router, useParams, Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom'; 

//handles all machines
function MachineCards({machines, joinSeen, toggleJoinPopup, currentPopupId, setMessage})
{

  const cards = []
  machines.forEach((machine) => {
    cards.push(
      <Card key={machine.id} machine={machine} joinSeen={joinSeen} toggleJoinPopup={toggleJoinPopup} currentPopupId={currentPopupId} machines={machines} setMessage={setMessage}/>
    )
  })

  const { machineId } = useParams(); 
  const tryToFindMachine = machines.find(m => m.id === machineId);

  if(!tryToFindMachine) {
    return (
      <div class="machine-cards">
        {cards}
      </div>
    )
  }

  return (
    <div class="machine-cards">
      <Card key={machineId} machine={tryToFindMachine} joinSeen={joinSeen} toggleJoinPopup={toggleJoinPopup} currentPopupId={currentPopupId} machines={machines} setMessage={setMessage}/>
    </div>
  )
}

//one machine card (machine name, join button, list of users waiting)
function Card({ machine, joinSeen, toggleJoinPopup, currentPopupId, machines, setMessage})
{

  let collapsible_text = machine.waitlist.length + " people waiting..."
  let estimated_time = machine.waitlist.length * 15 + " minutes"; 
  if(machine.waitlist.length == 0)
  {
    collapsible_text = "Waitlist is empty"
    estimated_time = "";
  }

  return (
    <div class="card">
        <div class="card-title">
          {machine.name}
            <button type="button" class="join-waitlist-button" onClick={() => toggleJoinPopup(machine.id)} >
              Join Waitlist
            </button>
            {joinSeen ? <JoinWaitlist toggle={toggleJoinPopup} id={currentPopupId} machines={machines} setMessage={setMessage}/> : null}
        </div>
        <div class="collapsible"> {/* todo: implement collapsible button, right now does nothing */}
          <button type="button" class="collapsible-button">
              <div class="collapsible-description">
              {collapsible_text}
              </div>
              <div class="collapsible-est-time">
              {estimated_time}
              </div>
          </button>
          <div>
            <CardList waitlist={machine.waitlist}/>
          </div>
        </div>
      </div>
  );
}

//list of users waiting inside the card (list of usernames + est time)
function CardList({waitlist})
{
    if(waitlist.length == 0)
    {
        return (<div></div>)
    }

    const table_rows = [];
    for (let i = 0; i < waitlist.length; i++)
    {
      table_rows.push(
        <tr key={i}>
          <td>
            {waitlist[i]}
          </td>
        </tr>
      )
    } 

    return (
      <table>
          {table_rows}
      </table>
    );
}

//sign up popup
function SignUp(props)
{
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')

  async function handleSignUp(e) {
      e.preventDefault()
      //handle signup
      if(password !== confirmPassword)
        props.setMessage("The two passwords do not match. Try again.");
            
      const userData = { username, password, email };
      try {
        // make the post request to /signup 
        const response = await fetch('/signup', {
          method: 'POST', // HTTP method
          headers: {
            'Content-Type': 'application/json', // we are sending JSON
          },
          body: JSON.stringify(userData), // converts the data to a JSON string
        });
        const data = await response.json(); 
        if (response.ok) {
          console.log('Signup successful', data); 
        } else {
          props.setMessage('Error during signup:', data.message); 
        }
      } catch (error) {
        props.setMessage('Network or server error:', error); 
      }
      props.toggle()
  }

  //todo: test that passwords match, add display/hide password functionality 
  return (
      <div className="popup">
          <div className="popup-inner">
              <h2>Sign Up</h2>
              <button className="close-button-top-right" onClick={props.toggle}>
                <span class="material-symbols-outlined">close</span>
              </button>
              <form onSubmit={handleSignUp}>
                  <label>
                      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                  </label>
                  <label>
                      <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                  </label>
                  <label>
                      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                  </label>
                  <label>
                      <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  </label>
                  <button type="submit">Sign Up</button>
              </form>
          </div>
      </div>
  )
}

//login popup
function Login(props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(e) {
      e.preventDefault()
      // handle login
      const userData = { username, password };
      
      try {
        // make the post request to /signup 
        const response = await fetch('/signup', {
          method: 'POST', // HTTP method
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify(userData), 
        });
        const data = await response.json(); 
        if (response.ok) {
          console.log('Login successful', data); 
        } else {
          props.setMessage('Error during login:', data.message); 
        }
      } catch (error) {
        props.setMessage('Network or server error:', error); 
      }
    
      props.toggle()  
  }

  return (
      <div className="popup">
          <div className="popup-inner">
              <h2>Login</h2>
              <button className="close-button-top-right" onClick={props.toggle}>
              <span class="material-symbols-outlined">close</span>
              </button>
              <form onSubmit={handleLogin}>
                  <label>
                      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                      
                  </label>
                  <label>
                      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                  </label>
                  <button type="submit">Login</button>
              </form>
          </div>
      </div>
  )
}

//join waitlist popup 
function JoinWaitlist({toggle, id, machines, setMessage}) {

  const foundMachine = machines.find(m => m.id === id);
  let machine_name = "";
  if(foundMachine) {
    machine_name = foundMachine.name;
  }

  async function handleJoinWaitlist(e) {
      e.preventDefault();
      const selectedEquipment = id; //the id of the machine that the user is trying to join
      //const token = localStorage.getItem('token'); // if JWT token in localStorage

      //handle joining waitlist
       try {
      // Validate user input <- I don't think we need this 
        if (!userId || !selectedEquipment) {
          setMessage("Please provide a valid user ID and equipment name");
          return;
        }

      // Send the POST request to the backend
      const response = await fetch('/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tell the backend you're sending JSON data
          //'Authorization': `Bearer ${token}`, // Send the JWT token in the Authorization header
        },
        body: JSON.stringify({ name: selectedEquipment }), // Send the desired equipment name
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Successfully joined the waitlist');
      } else {
        setMessage(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      setMessage('An error occurred. Please try again later.');
    }
    toggle()
    }

    return (
      <div className="popup">
          <div className="popup-inner">
              <h2>Join the Waitlist
              {foundMachine ? <div> of {machine_name}</div> : null}
              </h2>
              <label>When it is your turn on the waitlist, you will have 15 minutes.</label>
              <button className="close-button-top-right" onClick={toggle}>
              <span class="material-symbols-outlined">close</span>
              </button>
              <form onSubmit={handleJoinWaitlist}>
                  <button type="submit">Join</button>
              </form>
          </div>
      </div>
  )
}

function Error(props) {

  return (
      <div className="popup">
          <div className="popup-inner">
              <h3>{props.message}</h3>
              <button className="close-button-top-right" onClick={props.toggle}>
              <span class="material-symbols-outlined">close</span>
              </button>
          </div>
      </div>
  )
}

export default function App() {
  const [joinSeen, setJoinSeen] = useState(false)
  const [loginSeen, setLoginSeen] = useState(false)
  const [errorSeen, setErrorSeen] = useState(false)
  const [signUpSeen, setSignUpSeen] = useState(false)
  const [currentPopupId, setCurrentPopupId] = useState(null)
  const [currentErrorMessage, setCurrentErrorMessage] = useState(null)

  const toggleJoinPopup = (id) => {
    setCurrentPopupId(id);
    setJoinSeen(!joinSeen);
  };

  function toggleLoginPopup () {
    setLoginSeen(!loginSeen);
  };
  
  function toggleSignUpPopup () {
    setSignUpSeen(!signUpSeen);
  };

  function toggleErrorPopup (message) {
    setCurrentErrorMessage(message)
    setErrorSeen(!errorSeen);
  }

  return(
  <div>
    <div class="header">
      <div class="topnav">
        {/*<topnav-icon><img src="" alt="logo" width="30" height="30"></img></topnav-icon> <-- placeholder for logo, if we want*/} 
        <div class="topnav-icon"><span class="material-symbols-outlined">fitness_center</span></div>
        <Link class="topnav-appname" to="/kwong05/f24cs35l/">Bruin Wait-Lifting</Link>
        <div class="topnav-buttons" onClick={toggleLoginPopup}>
          Login
        </div>
        {loginSeen ? <Login toggle={toggleLoginPopup} setMessage={toggleErrorPopup}/> : null}
        <div class="topnav-buttons" onClick={toggleSignUpPopup}>
          Sign up
        </div>
        {signUpSeen ? <SignUp toggle={toggleSignUpPopup} setMessage={toggleErrorPopup}/> : null}
      </div>
      {errorSeen ? <Error toggle={toggleErrorPopup} message={currentErrorMessage} /> : null}
    </div>
    <Routes>
        <Route path="/kwong05/f24cs35l/" element={<MachineCards machines = {MACHINES} joinSeen={joinSeen} toggleJoinPopup={toggleJoinPopup} currentPopupId={currentPopupId} setMessage={toggleErrorPopup}/>} />
        <Route path="/kwong05/f24cs35l/:machineId" element={<MachineCards machines = {MACHINES} joinSeen={joinSeen} toggleJoinPopup={toggleJoinPopup} currentPopupId={currentPopupId} setMessage={toggleErrorPopup}/>} />
    </Routes>
  </div>
  );
}

async function getEquipmentNames() {
  try {
    // this gets all equipment objects from the mongo equpiment database
    const equipmentList = await equipment.find();
    // get only the name of each equipment
    const eqipNames = equipmentList.map(equipment => equipment.name);
    
    return eqipNames; 
  } catch (err) {
    console.error("Error retrieving equipment names:", err);
    return []; // Return an empty array in case of error
  }
}

//fake data
const MACHINES = [
  {name: "Treadmill 1", id: "treadmill_1", waitlist: ["username1", "username2", "username3"]},
  {name: "Treadmill 2", id: "treadmill_2", waitlist: []},
  {name: "Smith Machine", id: "smith", waitlist: ["username1", "username2"]},
];
//const MACHINES = getEquipmentNames();
