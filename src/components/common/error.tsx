import React from 'react';

interface IProps {
    message: string
}

export const Error: React.FC<IProps> = (props: IProps) => {
    return (
        <div className="container">
            <div className="row full p3">
                <div className="col-12" style={{ textAlign: 'center' }}>
                    <img src="/assets/img/error.png"
                        className="error"
                        alt="error"
                    />
                    <h3>{props.message}</h3>
                </div>
            </div>
        </div>
    );
};
