import React from 'react';

interface IFeatureItem {
    icon: string;
    title: string;
    descrip: string;
    link: string;
}
interface IProps {
    items: Array<IFeatureItem>;
}

export const AsymmetricBoxes = (props: IProps) => {
    return (
        <section className="service-area area-padding">
            <div className="container">
                <div className="row">
                    {
                        (props != null && props.items != null && props.items.length > 0)
                            ? props.items.map((item: IFeatureItem, index: number) => {
                                return (
                                    <div key={`${index}-${item.title}`} className="col-md-6 col-lg-4">
                                        <div className="single-service">
                                            <div className="service-icon">
                                                <i className={item.icon}></i>
                                            </div>
                                            <div className="service-content">
                                                <h5>{item.title}</h5>
                                                <p>{item.descrip}</p>
                                                <a href={item.link}>Read More</a>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                            : <div></div>
                    }
                </div>
            </div>
        </section>
    );
}