import clsx from "clsx";

interface PictureDetailsPanelProps extends React.ComponentProps<'div'> {
    title: string;
    description: string;
    src: string;
}

export function PictureDetailsPanel({
    title,
    description,
    src,
}: PictureDetailsPanelProps) {
    return (
        <div
            className={clsx(
                "flex flex-col items-start justify-center gap-1 p-4 bg-white/5 backdrop-blur-2xl rounded-lg",
                "absolute bottom-5 left-5",
            )}
            id="picture-details-panel"
        >
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="text-base text-white">{description}</p>
            <div className="flex flex-row gap-1 items-center">
                <p className="text-white">Source:</p>
                <a href={src} className="text-blue-500">{src}</a>
            </div>
        </div>
    );
};

