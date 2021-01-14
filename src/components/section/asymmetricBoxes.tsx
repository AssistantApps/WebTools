import React from 'react';

interface IFeatureItem {
    icon: string;
    title: string;
    descrip: string;
    link?: string;
}
interface IProps {
    items: Array<IFeatureItem>;
}

export const AsymmetricBoxes = (props: IProps) => {
    if (props != null && props.items != null && props.items.length > 0) {
        return (<div></div>);
    }
    return (
        <section className="service-area area-padding-5">
            <div className="container">
                <div className="row">
                    {
                        props.items.map((item: IFeatureItem, index: number) => {
                            return (
                                <div key={`${index}-${item.title}`} className="col-md-6 col-lg-4">
                                    <div className="single-service">
                                        <div className="service-icon">
                                            <i className={item.icon}></i>
                                        </div>
                                        <div className="service-content">
                                            <h5>{item.title}</h5>
                                            <p>{item.descrip}</p>
                                            {
                                                item.link && <a href={item.link}>Read More</a>
                                            }
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </section>
    );
}