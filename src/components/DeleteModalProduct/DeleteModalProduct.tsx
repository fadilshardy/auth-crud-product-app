import {
    ActionIcon,
    Button, Text
} from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { IconTrashX } from '@tabler/icons'

interface IDeleteModalProductProps {
    isLoading: boolean;
    handleProductDelete: (product_id: string) => void;
    product_id: string;
}

const DeleteModalProduct: React.FunctionComponent<IDeleteModalProductProps> = ({ isLoading, handleProductDelete, product_id }) => {
    const openModal = () => openConfirmModal({
        title: 'Please confirm your action',
        confirmProps: { color: 'red' },
        children: (
            <Text size="sm">
                Are you sure you want to delete this product?
            </Text>
        ),
        labels: { confirm: isLoading ? 'deleting...' : 'Confirm', cancel: 'Cancel' },
        onConfirm: () => handleProductDelete(product_id)
    });

    return <ActionIcon
        variant="subtle"
        color="red"
        component="button"
        onClick={openModal}
    >
        <IconTrashX />
    </ActionIcon>

};

export default DeleteModalProduct;
