// AddToCartModal.tsx
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { LectureItem } from "@/app/_configs/commonInfo";
import { handleCartAddClick } from "@/utils/cartButtonHandler";
import { getLocalStorageItemCount } from "@/utils/localStorageManager";

interface AddToCartModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedLecture: LectureItem | null;
    onCartUpdate: (count: number) => void;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({ isOpen, onClose, selectedLecture, onCartUpdate }) => {
    const addToCartAndUpdateCount = () => {
        if (selectedLecture) {
            handleCartAddClick(selectedLecture);
            const count = getLocalStorageItemCount("cartItem");
            onCartUpdate(count); // 장바구니 수량을 부모로 전달하여 업데이트
            onClose(); // 모달 닫기
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">장바구니에 추가</ModalHeader>
                <ModalBody>
                    <p>
                        <strong>{selectedLecture?.name}</strong> 과목을 장바구니에 추가하시겠습니까?
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        닫기
                    </Button>
                    <Button color="primary" onPress={addToCartAndUpdateCount}>
                        확인
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddToCartModal;
