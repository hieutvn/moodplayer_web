import { useEffect } from 'react';


export function useConfirmation() {

    const [showConfirm, setShowConfirm] = useState(false);

    const handleConfirmation = () => {

        setShowConfirm(true);

        const timeout = setTimeout(() => {
            setShowConfirm(false)
        }, 2000);
    }

}