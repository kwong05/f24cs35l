import React from 'react';

function CardList({ waitlist, machine }) {
    const [currentUsername, setCurrentUsername] = useState("");

    if (!waitlist) {
        return <div></div>;
    }

    useEffect(() => {
        const fetchUsername = async () => {
            let curr_id = [machine.currentUser];
          try {
            const response = await fetch('http://localhost:10000/api/users/fetchUserDetails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userIds: curr_id }),
            });
            if (!response.ok) {
              throw new Error('Error retrieving user details');
            }
            const data = await response.json();
            setCurrentUsername(data[0].username);
          } catch (error) {
            console.error('Error fetching usernames:', error);
          }
        };
        fetchUsername();
      }, [machine.userQueue]);

    return (
        <table>
        <tbody>
        {currentUsername ? <tr key={0}><td> Current user: {currentUsername} </td></tr> : null}
        {waitlist.toReversed().map((username, index) => (
                <div key={index} className="card-list-item">
                    {index+1}. {username}
                </div>
            ))}
        </tbody>
      </table>
    );
}

export default CardList;
