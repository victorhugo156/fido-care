import React, { forwardRef, useMemo } from 'react';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Colors from '../../constants/Colors';

const CustomBottomSheet = forwardRef(({ children, snapPointsStart = 2 }, ref) => {

/*"useMemo" will avoid the app render every time that 
the user change the size of the modal*/
    const snapPoints = useMemo(() => ['25%', '60%', '70%', '100%'], []);

    return (
        <BottomSheetModalProvider>
            <BottomSheetModal
                ref={ref}
                index={snapPointsStart}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                enableContentPanningGesture={false}
                backgroundStyle={{ backgroundColor: Colors.WHITE }}
                handleIndicatorStyle={{ backgroundColor: Colors.BRIGHT_BLUE }}
                style={{ borderRadius: 60, overflow: 'hidden' }}
            >
                {children}
            </BottomSheetModal>
        </BottomSheetModalProvider>
    );
});

export default CustomBottomSheet;