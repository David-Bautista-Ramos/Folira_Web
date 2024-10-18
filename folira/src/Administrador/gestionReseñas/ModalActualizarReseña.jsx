import { useEffect, useState } from 'react';
import useUpdateResena from '../../hooks/useUpdateReseña'

const ModalActualizarReseña = ({ isOpen, onClose, resenaId, obtenerResenas, token }) => {
    const [formData, setFormData] = useState({
        contenido: "",
        calificacion: "",
    });



    return(

        <></>
    );


};


export default ModalActualizarReseña;
