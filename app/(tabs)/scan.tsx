import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
  TextInput,
  Modal,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Camera, Image as ImageIcon, X, Loader2, Search, QrCode, Zap } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useRecycling } from "@/hooks/recycling-context";
import { identifyItem, identifyBarcode, searchItem } from "@/utils/ai-service";

const { width } = Dimensions.get("window");

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanMode, setScanMode] = useState<'camera' | 'barcode' | 'search'>('camera');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { addScanResult } = useRecycling();

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      console.log('Starting photo capture...');
      setIsProcessing(true);
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
      });
      
      console.log('Photo captured:', {
        uri: photo?.uri,
        hasBase64: !!photo?.base64,
        base64Length: photo?.base64?.length
      });
      
      if (photo?.base64) {
        setCapturedImage(photo.uri);
        await processImage(photo.base64);
      } else {
        console.error('No base64 data in photo');
        Alert.alert("Error", "Failed to capture photo data");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
      Alert.alert("Error", "Failed to capture photo: " + (error instanceof Error ? error.message : String(error)));
      setIsProcessing(false);
    }
  };

  const handlePickImage = async () => {
    try {
      console.log('Launching image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      console.log('Image picker result:', {
        canceled: result.canceled,
        hasAssets: !!result.assets,
        assetsLength: result.assets?.length,
        hasBase64: !!result.assets?.[0]?.base64
      });

      if (!result.canceled && result.assets[0].base64) {
        setCapturedImage(result.assets[0].uri);
        setIsProcessing(true);
        await processImage(result.assets[0].base64);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert("Error", "Failed to pick image: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const processImage = async (base64: string) => {
    try {
      console.log('Processing image with base64 length:', base64.length);
      const result = scanMode === 'barcode' 
        ? await identifyBarcode(base64)
        : await identifyItem(base64);
      
      console.log('AI Result:', result);
      addScanResult(result);
      
      // Clear states first
      setIsProcessing(false);
      setCapturedImage(null);
      
      // Navigate to scan result screen
      console.log('Navigating to scan-result with params:', {
        item: result.item,
        category: result.category,
        recyclable: result.recyclable.toString(),
        instructions: result.instructions,
        alternatives: JSON.stringify(result.alternatives),
        impact: result.impact,
      });
      
      router.push({
        pathname: "/scan-result",
        params: { 
          item: result.item,
          category: result.category,
          recyclable: result.recyclable.toString(),
          instructions: result.instructions,
          alternatives: JSON.stringify(result.alternatives),
          impact: result.impact,
        },
      });
    } catch (error) {
      console.error("Error processing image:", error);
      // Even if there's an error, provide a fallback result
      const fallbackResult = {
        item: "Unknown Item",
        category: "mixed",
        recyclable: false,
        instructions: "Unable to identify this item. Please check with your local recycling center for proper disposal instructions.",
        alternatives: ["Consider reusable alternatives", "Reduce consumption when possible"],
        impact: "Proper waste disposal helps protect our environment.",
      };
      
      addScanResult(fallbackResult);
      setIsProcessing(false);
      setCapturedImage(null);
      
      router.push({
        pathname: "/scan-result",
        params: { 
          item: fallbackResult.item,
          category: fallbackResult.category,
          recyclable: fallbackResult.recyclable.toString(),
          instructions: fallbackResult.instructions,
          alternatives: JSON.stringify(fallbackResult.alternatives),
          impact: fallbackResult.impact,
        },
      });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const result = await searchItem(searchQuery);
      addScanResult(result);
      setShowSearchModal(false);
      setSearchQuery('');
      router.push({
        pathname: "/scan-result",
        params: { 
          item: result.item,
          category: result.category,
          recyclable: result.recyclable.toString(),
          instructions: result.instructions,
          alternatives: JSON.stringify(result.alternatives),
          impact: result.impact,
        },
      });
    } catch (error) {
      console.error("Error searching item:", error);
      Alert.alert("Error", "Failed to find recycling information for this item.");
    } finally {
      setIsSearching(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setIsProcessing(false);
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Camera size={64} color="#10B981" />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need your permission to use the camera to scan items for recycling information.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (capturedImage) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
        {isProcessing ? (
          <View style={styles.processingOverlay}>
            <View style={styles.processingContainer}>
              <Loader2 size={48} color="#10B981" />
              <Text style={styles.processingText}>Loading...</Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef}
        style={styles.camera} 
        facing={facing}
      >
        <View style={styles.cameraOverlay}>
          <View style={styles.scanModeSelector}>
            <TouchableOpacity 
              style={[styles.modeButton, scanMode === 'camera' && styles.activeModeButton]}
              onPress={() => setScanMode('camera')}
            >
              <Camera size={20} color={scanMode === 'camera' ? '#FFFFFF' : '#10B981'} />
              <Text style={[styles.modeText, scanMode === 'camera' && styles.activeModeText]}>Item</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modeButton, scanMode === 'barcode' && styles.activeModeButton]}
              onPress={() => setScanMode('barcode')}
            >
              <QrCode size={20} color={scanMode === 'barcode' ? '#FFFFFF' : '#10B981'} />
              <Text style={[styles.modeText, scanMode === 'barcode' && styles.activeModeText]}>Barcode</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          
          <Text style={styles.instructionText}>
            {scanMode === 'barcode' ? 'Scan barcode to check recyclability' : 'Position item within the frame and tap capture'}
          </Text>
          
          <View style={styles.aiIndicator}>
            <Text style={styles.aiText}>🤖 AI-Powered Detection</Text>
            <Text style={styles.aiSubtext}>Advanced machine learning identifies multiple objects</Text>
          </View>
        </View>
      </CameraView>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => setShowSearchModal(true)}
        >
          <Search size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={handlePickImage}
        >
          <ImageIcon size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.captureButton} 
          onPress={handleCapture}
          disabled={isProcessing}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => setFacing(facing === "back" ? "front" : "back")}
        >
          <Camera size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showSearchModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.searchModal}>
          <View style={styles.searchHeader}>
            <TouchableOpacity onPress={() => setShowSearchModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.searchTitle}>Search Item</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <View style={styles.searchContent}>
            <Text style={styles.searchDescription}>
              Can&apos;t scan your item? Search for it manually to get recycling information.
            </Text>
            
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#6B7280" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Enter item name (e.g., plastic bottle, cardboard box)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.searchButton, !searchQuery.trim() && styles.searchButtonDisabled]}
              onPress={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
            >
              {isSearching ? (
                <Loader2 size={20} color="#FFFFFF" />
              ) : (
                <Zap size={20} color="#FFFFFF" />
              )}
              <Text style={styles.searchButtonText}>
                {isSearching ? 'Searching...' : 'Get Recycling Info'}
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.searchTip}>
              💡 Tip: Be specific! Instead of &quot;bottle&quot;, try &quot;plastic water bottle&quot; or &quot;glass wine bottle&quot;
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: width * 0.8,
    height: width * 0.8,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#10B981",
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionText: {
    position: "absolute",
    bottom: -50,
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  controls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#10B981",
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#10B981",
  },
  secondaryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(16, 185, 129, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#10B981",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  permissionText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  capturedImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  processingContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
  },
  processingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 15,
  },
  processingSubtext: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },

  aiIndicator: {
    position: "absolute",
    bottom: -120,
    backgroundColor: "rgba(16, 185, 129, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: "center",
  },
  aiText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  aiSubtext: {
    color: "#FFFFFF",
    fontSize: 12,
    opacity: 0.9,
    marginTop: 2,
  },
  retakeButton: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanModeSelector: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  activeModeButton: {
    backgroundColor: "#10B981",
  },
  modeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
  },
  activeModeText: {
    color: "#FFFFFF",
  },
  searchModal: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  searchContent: {
    flex: 1,
    padding: 20,
  },
  searchDescription: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 24,
    lineHeight: 24,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  searchButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  searchTip: {
    fontSize: 14,
    color: "#6B7280",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 20,
  },
});