import javax.swing.*;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

public class CarbonEquityTracker extends JFrame {
    private Connection conn;
    private PreparedStatement pst;
    private ResultSet rs;
    private JLabel statusLabel;
    private JTextField usernameField;
    private JPasswordField passwordField;
    private UserModePanel userModePanel;
    private IndustryModePanel industryModePanel;

    public CarbonEquityTracker() {
        setTitle("Carbon Equity Tracker");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(900, 704);
        setLocationRelativeTo(null);    
        initLoginPanel();
    }
    private void initLoginPanel() {
    	JPanel mainPanel = new JPanel(new BorderLayout());
        JPanel loginPanel = new JPanel(new GridBagLayout()) {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2d = (Graphics2D) g;
                int width = getWidth();
                int height = getHeight();
                GradientPaint gp = new GradientPaint(0, 0, new Color(0, 100, 0), width, height, new Color(34, 139, 34));
                g2d.setPaint(gp);
                g2d.fillRect(0, 0, width, height);
            }
        };
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        JLabel titleLabel = new JLabel("CARBON EQUITY TRACKER", JLabel.CENTER);
        titleLabel.setFont(new Font("Times New Roman", Font.BOLD, 55));
        titleLabel.setForeground(Color.WHITE);
        gbc.gridx = 0; gbc.gridy = 0;
        
        
        loginPanel.add(titleLabel, gbc);
        JLabel subtitleLabel = new JLabel("<html>Track, Reduce, Sustain!!</html>", JLabel.CENTER);
        subtitleLabel.setFont(new Font("Impact", Font.CENTER_BASELINE, 32));
        subtitleLabel.setForeground(Color.BLACK);
        gbc.gridy = 1;
        loginPanel.add(subtitleLabel, gbc);
        JLabel subtiLabel = new JLabel("<html><u>Login Page</u></html>", JLabel.CENTER);
        subtiLabel.setFont(new Font("Futura", Font.BOLD, 35));
        subtiLabel.setForeground(Color.WHITE);
        gbc.gridy = 2;
        loginPanel.add(subtiLabel,gbc);
        JLabel usernameLabel = new JLabel("UserID:");
        usernameLabel.setFont(new Font("Arial", Font.BOLD, 32));
        usernameLabel.setForeground(Color.WHITE);
        gbc.gridy = 4;
        loginPanel.add(usernameLabel, gbc);
        usernameField = new JTextField(20); 
        usernameField.setFont(new Font("Arial", Font.PLAIN, 26));
        gbc.gridy = 5;
        loginPanel.add(usernameField, gbc);
        JLabel passwordLabel = new JLabel("Password:");
        passwordLabel.setFont(new Font("Arial", Font.BOLD, 26));
        passwordLabel.setForeground(Color.WHITE);
        gbc.gridy = 6;
        loginPanel.add(passwordLabel, gbc);
        passwordField = new JPasswordField(20);
        passwordField.setFont(new Font("Arial", Font.PLAIN, 26));
        gbc.gridy = 7;
        loginPanel.add(passwordField, gbc);

        JButton loginButton = new JButton("Login");
        loginButton.setFont(new Font("Bell MT", Font.BOLD, 30));
        gbc.gridy = 8;
        loginPanel.add(loginButton, gbc);

        statusLabel = new JLabel("", JLabel.CENTER);
        statusLabel.setFont(new Font("Arial", Font.PLAIN, 16));
        statusLabel.setForeground(Color.RED);
        
        
        gbc.gridy = 9;
        loginPanel.add(statusLabel, gbc);
        add(loginPanel);
        loginButton.addActionListener(e -> login(usernameField.getText(), new String(passwordField.getPassword())));
        mainPanel.add(loginPanel, BorderLayout.CENTER);
        // Adding the right panel with an image
        JPanel imagePanel = new JPanel();
        imagePanel.setPreferredSize(new Dimension(350, 706));
        imagePanel.setLayout(new BorderLayout());
        ImageIcon icon = new ImageIcon("C:\\Users\\kumarasamy\\Desktop\\Java\\Eclipse\\CET_VER2\\src\\carblogin.png"); // Change to actual image path
        JLabel imageLabel = new JLabel(icon);
        imagePanel.add(imageLabel, BorderLayout.CENTER);
        mainPanel.add(imagePanel, BorderLayout.EAST);
        add(mainPanel);
    }
    private void login(String username, String password) {
        try {
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/cet_login", "root", "root");
            String query = "SELECT * FROM logincred WHERE username=? AND password=?";
            pst = conn.prepareStatement(query);
            pst.setString(1, username);
            pst.setString(2, password);
            rs = pst.executeQuery();
            if (rs.next()) {
                int userID = Integer.parseInt(username);
                if (userID >= 1 && userID <= 20) {
                    loadUserMode();
                } else if (userID >= 100 && userID <= 120) {
                    loadIndustryMode();
                } else {
                    statusLabel.setText("Invalid user.");
                }
            } else {
                statusLabel.setText("Invalid credentials.");
            }
        } catch (SQLException ex) {
            statusLabel.setText("Database connection failed.");
        } finally {
        	
            try {
                if (rs != null) rs.close();
                if (pst != null) pst.close();
                if (conn != null) conn.close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }}}
    private void loadUserMode() {
        if (userModePanel == null) userModePanel = new UserModePanel();
        setContentPane(userModePanel);
        revalidate();
        repaint();
    }
    private void loadIndustryMode() {
        if (industryModePanel == null) industryModePanel = new IndustryModePanel();
        setContentPane(industryModePanel);
        revalidate();
        repaint();
    }
    private class UserModePanel extends JPanel {
        private JComboBox<String> countryComboBox;
        private JSlider distanceSlider, wasteSlider, electricitySlider;
        private JTextField mealsField, userIdField;
        private JLabel distanceValueLabel, wasteValueLabel, electricityValueLabel;
        private JLabel[] resultLabels;
        private Connection connection;
        public UserModePanel() {
            setBackground(new Color(144, 238, 144));
            setLayout(new BorderLayout());
            JLabel titleLabel = new JLabel("CARBON EQUITY TRACKER - USER MODE", SwingConstants.CENTER);
            titleLabel.setFont(new Font("Arial", Font.BOLD, 42));
            add(titleLabel, BorderLayout.NORTH);
            // Components for user input
            JPanel inputPanel = new JPanel(new GridBagLayout());
            inputPanel.setBackground(new Color(144, 238, 144));
            GridBagConstraints gbc = new GridBagConstraints();
            gbc.fill = GridBagConstraints.HORIZONTAL;
            gbc.insets = new Insets(20, 20, 20, 20);
            
            // User ID
            userIdField = new JTextField();
            userIdField.setPreferredSize(new Dimension(250, 40));
            userIdField.setFont(new Font("Arial", Font.BOLD, 22));
            JLabel userIdLabel = new JLabel("User ID:");
            userIdLabel.setFont(new Font("Arial", Font.BOLD, 22));
            gbc.gridx = 0;
            gbc.gridy = 0;
            inputPanel.add(userIdLabel, gbc);
            gbc.gridx = 2;
            inputPanel.add(userIdField, gbc);
            // Country selection
            String[] countries = {"India", "Brazil", "China", "Japan"};
            countryComboBox = new JComboBox<>(countries);
            countryComboBox.setFont(new Font("Arial", Font.PLAIN, 22));
            JLabel countryLabel = new JLabel("Your Country:");
            countryLabel.setFont(new Font("Arial", Font.BOLD, 22));
            gbc.gridy = 1;
            gbc.gridx = 0;
            inputPanel.add(countryLabel, gbc);
            gbc.gridx = 2;
            inputPanel.add(countryComboBox, gbc);
            // Distance slider
            distanceSlider = createSlider(1, 100, 1);
            distanceValueLabel = new JLabel("Value: " + distanceSlider.getValue());
            JLabel distanceLabel = new JLabel("Daily Commute Distance (in km):");
            distanceLabel.setFont(new Font("Arial", Font.BOLD, 22));
            gbc.gridy = 2;
            gbc.gridx = 0;
            inputPanel.add(distanceLabel, gbc);
            gbc.gridx = 2;
            inputPanel.add(distanceSlider, gbc);
            gbc.gridx = 3;
            inputPanel.add(distanceValueLabel, gbc);
            // Waste slider
            wasteSlider = createSlider(1, 100, 1);
            wasteValueLabel = new JLabel("Value: " + wasteSlider.getValue());
            JLabel wasteLabel = new JLabel("Waste Generated (in kg):");
            wasteLabel.setFont(new Font("Arial",Font.BOLD, 22));
            
            gbc.gridy = 3;
            gbc.gridx = 0;
            inputPanel.add(wasteLabel, gbc);
            gbc.gridx = 2;
            inputPanel.add(wasteSlider, gbc);
            gbc.gridx = 3;
            inputPanel.add(wasteValueLabel, gbc);
            // Electricity slider
            electricitySlider = createSlider(1, 1000, 1);
            electricityValueLabel = new JLabel("Value: " + electricitySlider.getValue());
            JLabel electricityLabel = new JLabel("Monthly Electricity Consumption (in kWh):");
            electricityLabel.setFont(new Font("Arial",Font.BOLD,22));
            gbc.gridy = 4;
            gbc.gridx = 0;
            inputPanel.add(electricityLabel, gbc);
            gbc.gridx = 2;
            inputPanel.add(electricitySlider, gbc);
            gbc.gridx = 3;
            inputPanel.add(electricityValueLabel, gbc);
            // Meals field
            mealsField = new JTextField();
            mealsField.setPreferredSize(new Dimension(150, 40));
            JLabel mealsLabel = new JLabel("Number of Meals per Day:");
            mealsLabel.setFont(new Font("Arial",Font.BOLD,22));
            gbc.gridy = 5;
            gbc.gridx = 0;
            inputPanel.add(mealsLabel, gbc);
            gbc.gridx = 2;
            inputPanel.add(mealsField, gbc);
            add(inputPanel, BorderLayout.CENTER);
            // Calculate button
            JButton calculateButton = new JButton("Calculate Carbon Emission");
            calculateButton.setFont(new Font("Impact", Font.PLAIN, 20));
            calculateButton.addActionListener(e -> calculateEmissions());
            JPanel buttonPanel = new JPanel();
            buttonPanel.setBackground(new Color(144, 238, 144));
            buttonPanel.add(calculateButton);
            add(buttonPanel, BorderLayout.SOUTH);
            // Results panel
            JPanel resultPanel = new JPanel() {
                @Override
                protected void paintComponent(Graphics g) {
                    super.paintComponent(g);
                    Graphics2D g2d = (Graphics2D) g;
 
                    Color color1 = new Color(135, 206, 250); 
                    Color color2 = new Color(25, 25, 112); 
                    g2d.setPaint(new GradientPaint(0, 0, color1, 0, getHeight(), color2));
                    g2d.fillRect(0, 0, getWidth(), getHeight());
                }
            };
            resultPanel.setLayout(new BoxLayout(resultPanel, BoxLayout.Y_AXIS));
            resultPanel.setPreferredSize(new Dimension(400, 550));
            resultPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20)); 
            JLabel resultsHeading = new JLabel("RESULTS DASHBOARD", SwingConstants.CENTER);
            resultsHeading.setFont(new Font("Helvetica", Font.BOLD, 28)); 
            resultsHeading.setForeground(Color.WHITE);
            resultsHeading.setAlignmentX(Component.CENTER_ALIGNMENT);
            resultsHeading.setBorder(BorderFactory.createEmptyBorder(10, 0, 30, 0)); 
            resultPanel.add(resultsHeading);
            ImageIcon imageIcon = new ImageIcon("C:\\Users\\kumarasamy\\Desktop\\Java\\Eclipse\\CET_VER2\\src\\user.png");
            JLabel imageLabel = new JLabel(imageIcon);
            imageLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
            imageLabel.setBorder(BorderFactory.createEmptyBorder(20, 0, 20, 0)); 
            resultPanel.add(imageLabel);

            resultLabels = new JLabel[5];
            String[] icons = {"🌍", "🚗", "🗑️", "💡", "📊"};
            for (int i = 0; i < resultLabels.length; i++) {
                resultLabels[i] = new JLabel(icons[i], SwingConstants.CENTER);
                resultLabels[i].setFont(new Font("Segoe UI Emoji", Font.BOLD, 22)); 
                resultLabels[i].setForeground(Color.WHITE);
                resultLabels[i].setAlignmentX(Component.CENTER_ALIGNMENT);
                resultLabels[i].setBorder(BorderFactory.createCompoundBorder(
                    BorderFactory.createLineBorder(new Color(255, 255, 255, 100), 2),
                    BorderFactory.createEmptyBorder(10, 20, 10, 20) 
                ));
                resultPanel.add(resultLabels[i]);
            }
            add(resultPanel, BorderLayout.EAST);
            distanceSlider.addChangeListener(e -> distanceValueLabel.setText("Distance: " + distanceSlider.getValue()));
            wasteSlider.addChangeListener(e -> wasteValueLabel.setText("Waste: " + wasteSlider.getValue()));
            electricitySlider.addChangeListener(e -> electricityValueLabel.setText("Electricity: " + electricitySlider.getValue()));
            connectDatabase();
        }
        private JSlider createSlider(int min, int max, int initial) {
            JSlider slider = new JSlider(min, max, initial);
            slider.setMajorTickSpacing((max - min) / 5);
            slider.setPaintTicks(true);
            slider.setPaintLabels(true);
            return slider;}      
        
        private void calculateEmissions() {
            String userId = userIdField.getText();
            String selectedCountry = (String) countryComboBox.getSelectedItem();
            double distance = distanceSlider.getValue();
            double waste = wasteSlider.getValue();
            double electricity = electricitySlider.getValue();
            int meals;
            try {
                meals = Integer.parseInt(mealsField.getText());
            } catch (NumberFormatException e) {
                resultLabels[0].setText("Please enter a valid number for meals per day.");
                return;}
            double transportationCO2 = distance * 0.05;
            double wasteCO2 = waste * 0.1;
            double electricityCO2 = electricity * 0.4;
            double mealCO2 = meals * 0.3;
            double totalCO2 = Math.round((transportationCO2 + wasteCO2 + electricityCO2 + mealCO2) * 1000) / 1000.0;
            resultLabels[0].setText("Selected Country: " + selectedCountry);
            resultLabels[1].setText(String.format("Commute Emissions: %.2f kg", transportationCO2));
            resultLabels[2].setText(String.format("Waste Emissions: %.2f kg", wasteCO2));
            resultLabels[3].setText(String.format("Electricity Emissions: %.2f kg", electricityCO2));
            resultLabels[4].setText(String.format("Total CO2 Emissions: %.2f kg", totalCO2));
            insertData(userId, selectedCountry, transportationCO2, wasteCO2, electricityCO2, totalCO2);}
        private void connectDatabase() {
            try {
                connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/cet_user", "root", "root");
                String createTableSQL = "CREATE TABLE IF NOT EXISTS user_data (" +
                        "user_id VARCHAR(255), " +
                        "country VARCHAR(255), " +
                        "daily_commute_co2 DOUBLE, " +
                        "waste_co2 DOUBLE, " +
                        "electricity_co2 DOUBLE, " +
                        "total_co2 DOUBLE)";
                connection.createStatement().execute(createTableSQL);
            } catch (SQLException e) {
                e.printStackTrace();}}
        private void insertData(String userId, String country, double commuteCO2, double wasteCO2, double electricityCO2, double totalCO2) {
            String insertSQL = "INSERT INTO user_data (user_id, country, daily_commute_co2, waste_co2, electricity_co2, total_co2) VALUES (?, ?, ?, ?, ?, ?)";
            try (PreparedStatement pstmt = connection.prepareStatement(insertSQL)) {
                pstmt.setString(1, userId);
                pstmt.setString(2, country);
                pstmt.setDouble(3, commuteCO2);
                pstmt.setDouble(4, wasteCO2);
                pstmt.setDouble(5, electricityCO2);
                
                pstmt.setDouble(6, totalCO2);
                pstmt.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();}}}
    public class IndustryModePanel extends JPanel {
        private JTextField userIdField, rawMaterialsField;
        private JComboBox<String> processTypeComboBox, monthComboBox;
        private JSlider energySlider, totalWasteSlider, transportationSlider;
        private Connection industryConnection;
        private JLabel calculationDateLabel;
        private HashMap<String, ArrayList<String>> emissionSummaries = new HashMap<>();

        public IndustryModePanel() {
            setBackground(new Color(255, 255, 255));
            setLayout(new BorderLayout());
            JLabel titleLabel = new JLabel("CARBON EQUITY TRACKER - INDUSTRY MODE", SwingConstants.CENTER);
            titleLabel.setFont(new Font("Arial", Font.BOLD, 36));
            titleLabel.setForeground(new Color(34, 139, 34));
            add(titleLabel, BorderLayout.NORTH);
            JPanel inputPanel = new JPanel(new GridBagLayout());
            inputPanel.setBackground(new Color(240, 248, 255));
            GridBagConstraints gbc = new GridBagConstraints();
            gbc.fill = GridBagConstraints.HORIZONTAL;
            gbc.insets = new Insets(20, 20, 20, 20);
            // User ID
            gbc.gridx = 0;
            gbc.gridy = 0;
            inputPanel.add(createLabel("User ID:"), gbc);
            gbc.gridx = 2;
            userIdField = createTextField("Enter your unique user ID");
            inputPanel.add(userIdField, gbc);
            // Date Display
            gbc.gridy = 1;
            gbc.gridx = 0;
            gbc.gridwidth = 1;
            inputPanel.add(createLabel("Calculation Date:"), gbc);
            gbc.gridx = 2;
            gbc.gridwidth = 2;
            calculationDateLabel = new JLabel(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
            calculationDateLabel.setFont(new Font("Arial", Font.PLAIN, 22));
            inputPanel.add(calculationDateLabel, gbc);
            // Month Selection
            gbc.gridy = 2;
            gbc.gridx = 0;
            gbc.gridwidth = 1;
            
            inputPanel.add(createLabel("Month:"), gbc);
            gbc.gridx = 2;
            monthComboBox = new JComboBox<>(new String[]{
                    "January", "February", "March", "April", "May", "June", "July", "August",
                    "September", "October", "November", "December"
            });
            monthComboBox.setFont(new Font("Arial", Font.PLAIN, 22));
            inputPanel.add(monthComboBox, gbc);

            // Process Type
            gbc.gridy = 3;
            gbc.gridx = 0;
            inputPanel.add(createLabel("Type of Process:"), gbc);
            gbc.gridx = 2;
            processTypeComboBox = new JComboBox<>(new String[]{"Manufacturing", "Processing", "Assembly", "Other"});
            processTypeComboBox.setFont(new Font("Arial", Font.PLAIN, 22));
            processTypeComboBox.setToolTipText("Select the type of process");
            inputPanel.add(processTypeComboBox, gbc);

            // Energy Consumption Slider (10000 to 100000 kWh)
            gbc.gridy = 4;
            gbc.gridx = 0;
            inputPanel.add(createLabel("Energy Consumption (kWh):"), gbc);
            gbc.gridx = 2;
            energySlider = new JSlider(10000, 100000, 10000);
            energySlider.setMajorTickSpacing(20000);
            energySlider.setPaintTicks(true);
            energySlider.setPaintLabels(true);
            inputPanel.add(energySlider, gbc);
            inputPanel.add(createValueLabel(energySlider), createGridConstraints(gbc, 3));

            // Raw Material Usage Text Field
            gbc.gridy = 5;
            gbc.gridx = 0;
            inputPanel.add(createLabel("Raw Material Usage (tons):"), gbc);
            gbc.gridx = 2;
            rawMaterialsField = createTextField("Enter the total raw materials used in tons");
            inputPanel.add(rawMaterialsField, gbc);

            // Total Waste Produced Slider (1000 to 10000 tons)
            gbc.gridy = 6;
            gbc.gridx = 0;
            inputPanel.add(createLabel("Total Waste Produced (tons):"), gbc);
            gbc.gridx = 2;
            totalWasteSlider = new JSlider(1000, 10000, 1000);
            totalWasteSlider.setMajorTickSpacing(2000);
            totalWasteSlider.setPaintTicks(true);
            totalWasteSlider.setPaintLabels(true);
            inputPanel.add(totalWasteSlider, gbc);
            inputPanel.add(createValueLabel(totalWasteSlider), createGridConstraints(gbc, 3));

            // Total Transportation Distance Slider (1000 to 3000 km)
            gbc.gridy = 7;
            gbc.gridx = 0;
            inputPanel.add(createLabel("Total Transportation Distance (km):"), gbc);
            gbc.gridx = 2;
            transportationSlider = new JSlider(1000, 3000, 1000);
            transportationSlider.setMajorTickSpacing(500);
            transportationSlider.setPaintTicks(true);
            transportationSlider.setPaintLabels(true);
            inputPanel.add(transportationSlider, gbc);
            inputPanel.add(createValueLabel(transportationSlider), createGridConstraints(gbc, 3));

            add(inputPanel, BorderLayout.CENTER);

            JPanel buttonPanel = new JPanel();
            buttonPanel.setBackground(new Color(255, 255, 255));
            buttonPanel.add(createButton("Calculate Carbon Emission", Color.GREEN, e -> calculateEmissions()));
            buttonPanel.add(createButton("View Emission Summary", new Color(70, 130, 180), e -> viewEmissionSummary()));

            add(buttonPanel, BorderLayout.SOUTH);
            connectIndustryDatabase();
        }

        // Database connection method
        private void connectIndustryDatabase() {
            try {
                industryConnection = DriverManager.getConnection("jdbc:mysql://localhost:3306/cet_industry", "root", "root");
                String createTableSQL = "CREATE TABLE IF NOT EXISTS industry_data (" +
                        "user_id VARCHAR(255), " +
                        "month VARCHAR(50), " +
                        "process_type VARCHAR(255), " +
                        "energy_consumption DOUBLE, " +
                        "raw_material_usage DOUBLE, " +
                        "total_waste_produced DOUBLE, " +
                        "transportation_distance DOUBLE, " +
                        "total_emission DOUBLE)";
                industryConnection.createStatement().execute(createTableSQL);
            } catch (SQLException e) {
                e.printStackTrace();}}
        private JLabel createLabel(String text) {
            JLabel label = new JLabel(text);
            label.setFont(new Font("Arial", Font.BOLD, 22));
            return label;}
        private JTextField createTextField(String tooltip) {
            JTextField textField = new JTextField();
            textField.setPreferredSize(new Dimension(150, 40));
            textField.setFont(new Font("Arial", Font.PLAIN, 22));
            textField.setToolTipText(tooltip);
            return textField;}
        private JLabel createValueLabel(JSlider slider) {
            JLabel valueLabel = new JLabel("Value: " + slider.getValue());
            valueLabel.setFont(new Font("Arial", Font.PLAIN, 22));
            slider.addChangeListener(e -> valueLabel.setText("Value: " + slider.getValue()));
            return valueLabel;}
        private GridBagConstraints createGridConstraints(GridBagConstraints gbc, int gridx) {
            gbc.gridx = gridx;
            return gbc;}
        private JButton createButton(String text, Color color, ActionListener action) {
            JButton button = new JButton(text);
            button.setFont(new Font("Arial", Font.BOLD, 22));
            button.setBackground(color);
            button.setForeground(Color.WHITE);
            button.addActionListener(action);
            return button;}
        private void calculateEmissions() {
            String userId = userIdField.getText().trim();
            if (userId.isEmpty()) {
                JOptionPane.showMessageDialog(null, "Please enter a valid User ID.");
                return;
            }
            String selectedProcess = (String) processTypeComboBox.getSelectedItem();
            double energyConsumption = energySlider.getValue();
            double rawMaterials;
            double totalWaste = totalWasteSlider.getValue();
            double transportationDistance = transportationSlider.getValue();
            String month = (String) monthComboBox.getSelectedItem();
            try {
                rawMaterials = Double.parseDouble(rawMaterialsField.getText());
            } catch (NumberFormatException e) {
                JOptionPane.showMessageDialog(null, "Please enter a valid number for raw material usage.");
                return;
            }

            double energyCO2 = energyConsumption * 0.92;
            double rawMaterialsCO2 = rawMaterials * 1.5;
            double totalWasteCO2 = totalWaste * 0.2;
            double transportationCO2 = transportationDistance * 0.05;
            double totalCO2 = energyCO2 + rawMaterialsCO2 + totalWasteCO2 + transportationCO2;
            String date = calculationDateLabel.getText();

            // Check if total CO2 exceeds threshold and show warning
            if (totalCO2 > 45000) {
                showWarningPanel();
            }

            String summary = String.format("User: %s, Date: %s, Month: %s, Energy: %.2f kg, Raw Materials: %.2f kg, Waste: %.2f kg, Transportation: %.2f kg, Total: %.2f kg",
                    userId, date, month, energyCO2, rawMaterialsCO2, totalWasteCO2, transportationCO2, totalCO2);
            emissionSummaries.computeIfAbsent(userId, k -> new ArrayList<>()).add(summary);

            JOptionPane.showMessageDialog(null, String.format("Total CO2 Emission for %s in %s is %.2f kg", userId, month, totalCO2));
            insertIndustryData(userId, month, selectedProcess, energyConsumption, rawMaterials, totalWaste, transportationDistance, totalCO2);
        }

        // Method to show the warning panel
        private void showWarningPanel() {
            JPanel warningPanel = new JPanel();
            warningPanel.setBackground(new Color(255, 69, 0));
            warningPanel.setLayout(new BoxLayout(warningPanel, BoxLayout.Y_AXIS));

            JLabel warningLabel = new JLabel("<html><div style='text-align: center;'>"
                    + "<b>Warning:</b><br>Total CO₂ emission exceeds 45,000 kg.<br>"
                    + "This is above the average emission level for other companies.<br>"
                    + "Please consider reducing your carbon footprint for a safer world.</div></html>");
            warningLabel.setFont(new Font("Arial", Font.BOLD, 24));
            warningLabel.setForeground(Color.WHITE);
            warningLabel.setHorizontalAlignment(SwingConstants.CENTER);
            warningPanel.add(Box.createRigidArea(new Dimension(0, 10)));
            warningPanel.add(warningLabel);
            warningPanel.add(Box.createRigidArea(new Dimension(0, 10)));

            JOptionPane.showMessageDialog(null, warningPanel, "High Emission Warning", JOptionPane.WARNING_MESSAGE);
        }
        private void insertIndustryData(String userId, String month, String processType, double energy, double rawMaterials,
                                        double waste, double distance, double totalCO2) {
            String insertSQL = "INSERT INTO industry_data (user_id, month, process_type, energy_consumption, " +
                    "raw_material_usage, total_waste_produced, transportation_distance, total_emission) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement pstmt = industryConnection.prepareStatement(insertSQL)) {
                pstmt.setString(1, userId);
                pstmt.setString(2, month);
                pstmt.setString(3, processType);
                pstmt.setDouble(4, energy);
                pstmt.setDouble(5, rawMaterials);
                pstmt.setDouble(6, waste);
                pstmt.setDouble(7, distance);
                pstmt.setDouble(8, totalCO2);
                pstmt.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        private void viewEmissionSummary() {
            String userId = userIdField.getText().trim();
            if (userId.isEmpty() || !emissionSummaries.containsKey(userId)) {
                JOptionPane.showMessageDialog(null, "Please enter a valid User ID with recorded emissions.");
                return;
            }
            ArrayList<String> summaries = emissionSummaries.get(userId);
            StringBuilder message = new StringBuilder("<html><div style='font-size:20px'><b>Emission Summary for User: ").append(userId).append("</b><br/><br/>");
            for (String summary : summaries) {
                String[] fields = summary.split(",");
                for (String field : fields) {
                    message.append(field.trim()).append("<br/>");
                } 
                message.append("<br/>").append("<br/>");
            }
            message.append("</div></html>");
            JLabel summaryLabel = new JLabel(message.toString());
            summaryLabel.setFont(new Font("Times New Roman", Font.PLAIN, 22));
            JScrollPane scrollPane = new JScrollPane(summaryLabel);
            scrollPane.setPreferredSize(new Dimension(500, 400));
            JOptionPane.showMessageDialog(null, scrollPane, "Emission Summary", JOptionPane.INFORMATION_MESSAGE);
        }
    }
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            CarbonEquityTracker frame = new CarbonEquityTracker();
            frame.setVisible(true);
        });
    }
}
