import React from 'react';

function CardList({ waitlist }) {

    if (!waitlist) {
        return <div></div>;
    }

    return (
        <table>
            <tbody>
                {waitlist.map((username, index) => (
                    <div key={index} className="card-list-item">
                        {index + 1}. {username}
                    </div>
                ))}
            </tbody>
        </table>
    );
}

export default CardList;
