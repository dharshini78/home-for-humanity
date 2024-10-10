import React, { useState } from 'react';

const UnitConverter = () => {
    const [value, setValue] = useState(0);
    const [fromUnit, setFromUnit] = useState('mm');
    const [toUnit, setToUnit] = useState('cm');

    const units = ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'];

    const convertUnits = (value, fromUnit, toUnit) => {
        const metersValue = parseFloat(value) || 0;

        const meterConversions = {
            m: 1,
            cm: 100,
            mm: 1000,
            km: 1 / 1000,
            in: 39.3701,
            ft: 3.28084,
            yd: 1.09361,
            mi: 1 / 1609.34,
        };

        const valueInMeters = metersValue / meterConversions[fromUnit];
        return valueInMeters * meterConversions[toUnit];
    };

    const handleInputChange = (event) => {
        const newValue = event.target.value;
        setValue(newValue);
    };

    const handleFromUnitChange = (event) => {
        const newUnit = event.target.value;
        setFromUnit(newUnit);
    };

    const handleToUnitChange = (event) => {
        const newUnit = event.target.value;
        setToUnit(newUnit);
    };

    const convertedValue = convertUnits(value, fromUnit, toUnit);

    // Inline styles using JavaScript objects
    const styles = {
        container: {
            maxWidth: '400px',
            margin: '0 auto',
            padding: '10px',
            backgroundColor: '#f9f9f9',
        },
        title: {
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
            fontSize: '1.2rem',  // Reduced font size
            marginBottom: '15px',
            color: '#333',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
        },
        formGroup: {
            display: 'flex',
            alignItems: 'center',
        },
        label: {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            marginRight: '10px',
            color: '#555',
        },
        input: {
            padding: '6px',
            fontSize: '16px',
            width: '100%',
            boxSizing: 'border-box',
        },
        dropdown: {
            padding: '6px',
            fontSize: '16px',
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Unit Converter</h2>
            <form style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Value:</label>
                    <input
                        type="number"
                        style={styles.input}
                        value={value}
                        onChange={handleInputChange}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>From Unit:</label>
                    <select
                        style={styles.dropdown}
                        value={fromUnit}
                        onChange={handleFromUnitChange}
                    >
                        {units.map((unit) => (
                            <option key={unit} value={unit}>
                                {unit.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>To Unit:</label>
                    <select
                        style={styles.dropdown}
                        value={toUnit}
                        onChange={handleToUnitChange}
                    >
                        {units.map((unit) => (
                            <option key={unit} value={unit}>
                                {unit.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Converted Value:</label>
                    <input
                        type="number"
                        style={styles.input}
                        value={convertedValue}
                        readOnly
                    />
                </div>
            </form>
        </div>
    );
};

export default UnitConverter;
