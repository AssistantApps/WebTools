export interface ILazyLoadImageProps {
    src: string;
    notFoundImageSrc?: string;
    alt: string;
    style?: any;
    title?: string;
    effect?: 'blur' | 'black-and-white' | 'opacity';
    className?: string;
    draggable?: boolean;
    height?: string;
}