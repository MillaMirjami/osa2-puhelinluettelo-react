const Notification = ({message, errorMessage}) => {
    const errorStyle = {
        color: 'red'
    }
    if(message === null) {
        return null
    }
    if(errorMessage !== null)
    {
        return (
            <div className="notification" style={errorStyle}>
                {errorMessage}
            </div>
        )
    }
    return (
        <div className="notification">
            {message}
        </div>
    )
}

export default Notification