import React from 'react';

interface IProps {
    message: string
}

export const Error: React.FC<IProps> = (props: IProps) => {
    return (
        <div className="container">
            <div className="row full pt3">
                <div className="col-12" style={{ textAlign: 'center' }}>
                    <img src="/assets/img/error.svg"
                        alt="error"
                    />
                </div>
            </div>
        </div>
    );
};
