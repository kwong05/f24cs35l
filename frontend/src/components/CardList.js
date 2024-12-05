import React from 'react';

function CardList({ waitlist }) {
    if (!waitlist) {
        return <div></div>;
    }

    const tableRows = waitlist.map((user, index) => (
        <tr key={index}>
            <td>{user}</td>
        </tr>
    ));

    return (
        <div className="card-list">
            {waitlist.map((username, index) => (
                <div key={index} className="card-list-item">
                    {username}
                </div>
            ))}
        </div>
    );
}

export default CardList;