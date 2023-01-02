import { TextInput, Button, Group } from '@mantine/core';
import { openModal, closeAllModals } from '@mantine/modals';
import { IconCirclePlus } from '@tabler/icons'
import { useState } from 'react';


interface IAddProductModalProps {
    isLoading: boolean;
    handleProductCreate: (event: React.FormEvent<HTMLFormElement>) => void;
}

const AddProductModal: React.FunctionComponent<IAddProductModalProps> = ({ handleProductCreate, isLoading }) => {
    return <>
        <Group position="center">
            <Button
                rightIcon={<IconCirclePlus />}
                onClick={() => {
                    openModal({
                        title: 'Create new Product',
                        children: (
                            <>
                                <form onSubmit={handleProductCreate}>
                                    <TextInput label="Nama" name="name" placeholder="Product name" data-autofocus required disabled={isLoading} />
                                    <TextInput label="Harga" name="price" placeholder="Price" data-autofocus required disabled={isLoading} />

                                    {/* @ts-ignore  */}
                                    <Button fullWidth onClick={closeAllModals} mt="md" type="submit" >
                                        {isLoading ? 'loading..' : 'Submit'}
                                    </Button>
                                </form>
                            </>
                        ),
                    });
                }}
            >
                Product
            </Button>
        </Group>
    </>;
};

export default AddProductModal;
