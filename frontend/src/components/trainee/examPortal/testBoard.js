import React, { useState, useEffect } from 'react';
import './portal.css';
import Sidepanel from './sidepanel';
import Question from './question';
import { Drawer } from 'antd';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
}

function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

export default function TestBoard(props) {
    const { height, width } = useWindowDimensions();
    const [visible, setVisible] = useState(false);

    const onClose = () => setVisible(false);
    const onOpen = () => setVisible(true);

    return (
        <div className="exam-dashboard-wrapper">
            <Question mode={width > 768 ? 'desktop' : 'mobile'} triggerSidebar={onOpen} />
            {width > 768 ? (
                <Sidepanel mode="desktop" />
            ) : (
                <Drawer
                    title="Toolbar"
                    placement="right"
                    closable={true}
                    onClose={onClose}
                    visible={visible}
                    width="100%"
                >
                    <Sidepanel mode="mobile" />
                </Drawer>
            )}
        </div>
    );
}